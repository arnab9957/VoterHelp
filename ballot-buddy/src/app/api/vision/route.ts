import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType, query } = await req.json();

    if (!imageBase64) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    const systemInstruction = `You are Ballot Buddy, an election expert assistant capable of analyzing images of documents.
    If the user uploads an ID card, evaluate if it is generally an acceptable form of ID for voting purposes (but add a disclaimer to check specific state laws).
    If they upload an election mailer or document, explain what it is.
    Always maintain a neutral, non-partisan tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { text: query || "What can you tell me about this election-related document?" },
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType || 'image/jpeg'
            }
          }
        ]
      }],
      config: {
        systemInstruction,
        temperature: 0.1,
      }
    });

    return Response.json({ text: response.text });
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    return Response.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
