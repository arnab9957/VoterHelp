import { streamText, generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { insforge } from '@/lib/insforge';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'edge';

// Phrases that signal the model is uncertain
const UNCERTAINTY_PHRASES = [
  "i'm not sure",
  "i am not sure",
  "i cannot guarantee",
  "may vary",
  "you should verify",
  "check with",
  "please confirm",
  "i don't have",
  "i do not have",
  "i'm unable",
  "i am unable",
];

function needsDisclaimer(text: string): boolean {
  const lower = text.toLowerCase();
  return UNCERTAINTY_PHRASES.some((p) => lower.includes(p));
}

async function summarizeHistory(
  google: ReturnType<typeof createGoogleGenerativeAI>,
  modelName: string,
  history: { role: string; content: string }[]
) {
  const historyText = history
    .map((m) => `${m.role === 'user' ? 'User' : 'Ballot Buddy'}: ${m.content}`)
    .join('\n');

  const { text } = await generateText({
    model: google(modelName),
    prompt: `Summarize the following election assistance conversation in 3-4 bullet points. Keep only the most important user facts and answers:\n\n${historyText}`,
  });

  return text;
}

export async function POST(req: Request) {
  let resolvedModel = 'gemini-2.5-flash';

  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip, 15, 60000)) {
      return Response.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages, userState, userRole, language, apiKey, modelName } = body;
    resolvedModel = modelName || 'gemini-2.5-flash';

    const resolvedApiKey = apiKey || process.env.GEMINI_API_KEY || '';

    if (!resolvedApiKey) {
      return Response.json(
        { error: 'No API key configured. Please add a Gemini API key in Settings.' },
        { status: 400 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey: resolvedApiKey });

    // Map messages for AI SDK — only text messages, non-empty content
    let coreMessages: { role: 'user' | 'assistant'; content: string }[] =
      (messages ?? [])
        .filter((m: any) => m.type === 'text' && m.text?.trim())
        .map((msg: any) => ({
          role: (msg.isUser ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.text as string,
        }));

    // Guard: Gemini requires at least one user message
    if (coreMessages.length === 0 || coreMessages.at(-1)?.role !== 'user') {
      coreMessages.push({ role: 'user', content: 'Hello, can you help me?' });
    }

    // Conversation summarization: compress if >15 messages
    let contextNote = '';
    if (coreMessages.length > 15) {
      const toSummarize = coreMessages.slice(0, coreMessages.length - 6);
      const recent = coreMessages.slice(coreMessages.length - 6);
      try {
        const summary = await summarizeHistory(google, resolvedModel, toSummarize);
        contextNote = `\n\nEarlier conversation summary:\n${summary}\n`;
        coreMessages = recent;
      } catch {
        // Summarization failed — just use last 10 messages
        coreMessages = coreMessages.slice(-10);
      }
    }

    const systemInstruction = `You are Ballot Buddy, a non-partisan, highly accurate election expert assistant.
Your primary goal is to guide users through the election process. You are knowledgeable about both US elections (including NVRA, UOCAVA, and state guidelines) and international elections, including India.
Never show partisan bias or endorse any candidate or party. Provide helpful, well-structured answers.
The user is currently voting from: ${userState || 'Unknown Location'}
The user's role is: ${userRole || 'Civilian'}
${language && language !== 'English' ? `Respond strictly in the following language: ${language}` : ''}
${contextNote}
Answer concisely using Markdown formatting. Always cite specific laws or agencies when possible (e.g. "Per 52 U.S.C. §20501...").
If you are uncertain about specific information, say so clearly.`;

    const result = streamText({
      model: google(resolvedModel),
      system: systemInstruction,
      messages: coreMessages,
      async onFinish({ text }) {
        const finalText = needsDisclaimer(text)
          ? text +
            '\n\n---\n> \u26a0\ufe0f **Always verify election deadlines and rules directly with your local election office or state\u2019s official election website**, as regulations may change.'
          : text;

        // Log to InsForge — never let this failure surface
        try {
          const lastUserMessage =
            coreMessages.filter((m) => m.role === 'user').at(-1)?.content ?? 'Hello';
          await insforge.database.from('user_interactions').insert([
            {
              location: userState || 'Unknown',
              role: userRole || 'Civilian',
              query: lastUserMessage,
              response: finalText,
              language: language || 'English',
            },
          ]);
        } catch {
          // Silently ignore DB logging failures
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);

    // Log to InsForge — fire and forget via async IIFE (PostgrestFilterBuilder isn't a Promise)
    void (async () => {
      try {
        await insforge.database.from('error_logs').insert([{
          route: '/api/chat',
          error_message: error?.message ?? String(error),
          stack: error?.stack?.slice(0, 4000) ?? '',
          context: { model: resolvedModel },
        }]);
      } catch { /* ignore */ }
    })();

    return Response.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}
