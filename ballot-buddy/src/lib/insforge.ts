import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

if (!baseUrl || !anonKey) {
  console.warn('InsForge credentials missing. Database logging will be disabled.');
} else {
  console.log('InsForge initialized with URL:', baseUrl);
}

export const insforge = createClient({
  baseUrl,
  anonKey,
});
