import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages, userState, userRole, language } = await req.json();

    const systemInstruction = `You are Ballot Buddy, a non-partisan, highly accurate election expert assistant.
    Your primary goal is to guide users through the election process, focusing on the National Voter Registration Act (NVRA), UOCAVA, and related state-specific guidelines.
    Never show partisan bias or endorse any candidate or party. Provide helpful, structured answers.
    The user is currently voting from: ${userState || 'Unknown Location'}
    The user's role is: ${userRole || 'Civilian'}
    The user requested a voting plan. Create a customized, step-by-step checklist based on their state and role. Include specific dates or deadlines if possible, or advise them where to find them. Format as a markdown list.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemInstruction,
    });

    // Map frontend messages to Gemini format and ensure alternating roles
    const history: any[] = [];
    let lastRole = '';

    messages.forEach((msg: any) => {
      if (msg.type !== 'text') return;
      
      const role = msg.isUser ? 'user' : 'model';
      if (role !== lastRole) {
        history.push({
          role: role,
          parts: [{ text: msg.text || '' }]
        });
        lastRole = role;
      } else if (history.length > 0) {
        history[history.length - 1].parts[0].text += '\n' + (msg.text || '');
      }
    });

    // Ensure it ends with 'model' before we add the final 'user' prompt
    if (history.length > 0 && history[history.length - 1].role === 'user') {
      history.push({
        role: 'model',
        parts: [{ text: 'I have analyzed your situation.' }]
      });
    }

    const result = await model.generateContent({
      contents: [...history, { role: 'user', parts: [{ text: 'Generate my voting plan.' }] }],
    });
    const response = await result.response;
    const text = response.text();

    return Response.json({ text });
  } catch (error) {
    console.error('Gemini Plan API Error:', error);
    return Response.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}
