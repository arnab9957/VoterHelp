
const { createClient } = require('@insforge/sdk');
require('dotenv').config({ path: '.env.local' });

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

async function test() {
  console.log('Inserting to user_interactions...');
  const { data, error } = await insforge.database
    .from('user_interactions')
    .insert([{ query: 'SDK test', response: 'success' }])
    .select();
    
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success:', data);
  }
}

test();
