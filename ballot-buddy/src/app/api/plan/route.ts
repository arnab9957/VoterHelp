import { generateObject } from 'ai';
import { z } from 'zod';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { insforge } from '@/lib/insforge';
import { checkRateLimit } from '@/lib/rateLimit';
import { logError } from '@/lib/logError';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip, 5, 60000)) {
      return Response.json({ error: 'Too many requests, please slow down.' }, { status: 429 });
    }

    const { messages, userState, userRole, language, apiKey, modelName } = await req.json();

    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GEMINI_API_KEY || '',
    });

    const systemInstruction = `You are Ballot Buddy, a non-partisan, highly accurate election expert assistant.
    The user is currently voting from: ${userState || 'Unknown Location'}
    The user's role is: ${userRole || 'Civilian'}
    ${language ? `Translate the output to this language: ${language}` : ''}
    Generate a comprehensive, customized voting plan containing exactly two sections:
    1. A summary of their plan (Markdown text).
    2. An array of specific timeline events/deadlines based on their state and role. Include specific dates in 'YYYY-MM-DD' format if known, or descriptive text like 'Early October'.`;

    // Map messages
    const coreMessages = messages.filter((m: any) => m.type === 'text').map((msg: any) => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text || '',
    }));

    coreMessages.push({ role: 'user', content: 'Generate my voting plan.' });

    const result = await generateObject({
      model: google(modelName || 'gemini-2.5-flash'),
      schema: z.object({
        summary: z.string().describe('A detailed summary text of the voting plan in Markdown format.'),
        events: z.array(z.object({
          date: z.string().describe('Date of the event (e.g. 2024-11-05 or October 15)'),
          title: z.string().describe('Short title of the milestone'),
          description: z.string().describe('Detailed description of what to do by this date')
        })).describe('A chronological list of deadlines and action items.')
      }),
      system: systemInstruction,
      messages: coreMessages,
    });

    try {
      await insforge.database.from('user_interactions').insert([{
        location: userState || 'Unknown',
        role: userRole || 'Civilian',
        query: 'Generate voting plan',
        response: result.object.summary,
        language: language || 'English'
      }]);
    } catch (dbError) {
      console.error('Failed to log to InsForge:', dbError);
    }

    return Response.json(result.object);
  } catch (error: any) {
    console.error('Plan API Error:', error);
    await logError({ route: '/api/plan', error });
    return Response.json({ error: 'Failed to generate plan', details: error.message }, { status: 500 });
  }
}

