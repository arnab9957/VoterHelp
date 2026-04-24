import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const systemInstruction = `You are Ballot Buddy, a non-partisan, highly accurate election expert assistant.
    Your primary goal is to provide concise, direct answers to common election questions based on the National Voter Registration Act (NVRA), UOCAVA, and federal guidelines.
    Never show partisan bias or endorse any candidate or party. Keep answers under 3 sentences if possible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction,
        temperature: 0.1,
      }
    });

    return Response.json({ answer: response.text });
  } catch (error) {
    console.error('Gemini API Error in Search:', error);
    return Response.json({ error: 'Failed to search' }, { status: 500 });
  }
}
