import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, userState, userRole, language } = await req.json();

    const systemInstruction = `You are Ballot Buddy, a non-partisan, highly accurate election expert assistant.
    Your primary goal is to guide users through the election process, focusing on the National Voter Registration Act (NVRA), UOCAVA, and related state-specific guidelines.
    Never show partisan bias or endorse any candidate or party. Provide helpful, structured answers.
    The user is currently voting from: ${userState || 'Unknown Location'}
    The user's role is: ${userRole || 'Civilian'}
    ${language ? `Respond strictly in the following language: ${language}` : ''}
    Answer concisely and clearly using Markdown formatting where appropriate.`;

    // Map frontend messages to Gemini format
    // Assuming messages come in as { isUser: boolean, text: string }
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.text || '' }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    return Response.json({ text: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
