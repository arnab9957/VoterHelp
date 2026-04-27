import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    const { messages, userState, userRole, language } = body;

    const systemInstruction = `You are Ballot Buddy, a non-partisan, highly accurate election expert assistant.
    Your primary goal is to guide users through the election process, focusing on the National Voter Registration Act (NVRA), UOCAVA, and related state-specific guidelines.
    Never show partisan bias or endorse any candidate or party. Provide helpful, structured answers.
    The user is currently voting from: ${userState || 'Unknown Location'}
    The user's role is: ${userRole || 'Civilian'}
    ${language ? `Respond strictly in the following language: ${language}` : ''}
    Answer concisely and clearly using Markdown formatting where appropriate.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemInstruction,
    });

    // Map frontend messages to Gemini format and ensure alternating roles
    const history: any[] = [];
    let lastRole = '';

    messages.slice(0, -1).forEach((msg: any) => {
      if (msg.type !== 'text') return;
      
      const role = msg.isUser ? 'user' : 'model';
      // Gemini requires roles to alternate User -> Model -> User ...
      if (role !== lastRole) {
        history.push({
          role: role,
          parts: [{ text: msg.text || '' }]
        });
        lastRole = role;
      } else if (history.length > 0) {
        // Append text to the last message of the same role if they are consecutive
        history[history.length - 1].parts[0].text += '\n' + (msg.text || '');
      }
    });

    // Final check: if history ends with 'user', we need to append a dummy model response 
    // or remove the last user message to ensure the next message (which is 'user') works.
    if (history.length > 0 && history[history.length - 1].role === 'user') {
      history.push({
        role: 'model',
        parts: [{ text: 'I understand. Please continue.' }]
      });
    }

    const lastMessage = messages[messages.length - 1]?.text || 'Hello';

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return Response.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return Response.json({ 
      error: 'Failed to generate response',
      details: error.message
    }, { status: 500 });
  }
}
