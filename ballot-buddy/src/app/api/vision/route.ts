import { GoogleGenerativeAI } from '@google/generative-ai';
import { insforge } from '@/lib/insforge';
import { checkRateLimit } from '@/lib/rateLimit';
import { logError } from '@/lib/logError';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip, 10, 60000)) {
      return Response.json({ error: 'Too many requests, please slow down.' }, { status: 429 });
    }

    const { imageBase64, mimeType, query, apiKey, modelName } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY || '');

    if (!imageBase64) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    const systemInstruction = `You are Ballot Buddy, an election expert assistant capable of analyzing images of documents.
    If the user uploads an ID card, evaluate if it is generally an acceptable form of ID for voting purposes (but add a disclaimer to check specific state laws).
    If they upload an election mailer or document, explain what it is.
    Always maintain a neutral, non-partisan tone.`;

    const model = genAI.getGenerativeModel({ 
      model: modelName || 'gemini-2.5-flash',
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

    // Log to InsForge
    try {
      await insforge.database.from('user_interactions').insert([{
        query: `[Vision] ${query || 'Analyze document'}`,
        response: text,
      }]);
    } catch (dbError) {
      console.error('Failed to log to InsForge:', dbError);
    }

    return Response.json({ text });
  } catch (error: any) {
    console.error('Vision API Error:', error);
    await logError({ route: '/api/vision', error });
    return Response.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
