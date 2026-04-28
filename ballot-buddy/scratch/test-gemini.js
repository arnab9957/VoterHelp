
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    // Since ListModels is not easily available on the genAI object in some versions of the SDK, 
    // let's just try a few common ones.
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
    for (const m of models) {
      console.log(`Testing model: ${m}`);
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`Success with ${m}:`, response.text());
        break;
      } catch (e) {
        console.error(`Failed with ${m}:`, e.message);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
