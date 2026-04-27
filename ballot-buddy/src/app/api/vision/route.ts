import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent([
      query || "What can you tell me about this election-related document?",
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || 'image/jpeg'
        }
      }
    ]);
    const response = await result.response;
    const text = response.text();

    return Response.json({ text });
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    return Response.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
