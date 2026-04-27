import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log('Search Query:', query);

    const systemInstruction = `You are Ballot Buddy, a non-partisan, highly accurate election expert assistant.
    Your primary goal is to provide concise, direct answers to common election questions based on the National Voter Registration Act (NVRA), UOCAVA, and federal guidelines.
    Never show partisan bias or endorse any candidate or party. Keep answers under 3 sentences if possible.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(query);
    const response = await result.response;
    
    // Check if the response was blocked
    if (response.promptFeedback?.blockReason) {
      return Response.json({ 
        answer: "I'm sorry, I cannot answer that question due to safety filters. Please ask another election-related question.",
        blocked: true,
        reason: response.promptFeedback.blockReason
      });
    }

    const text = response.text();
    
    if (!text) {
      return Response.json({ 
        answer: "I couldn't find a specific answer for that. Please try rephrasing your question.",
        error: "Empty response"
      });
    }

    return Response.json({ answer: text });
  } catch (error: any) {
    console.error('Gemini API Error in Search:', error);
    return Response.json({ 
      error: 'Failed to search', 
      details: error.message
    }, { status: 500 });
  }
}
