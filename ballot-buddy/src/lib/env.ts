import { z } from 'zod';

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(10, 'GEMINI_API_KEY is missing or too short'),
  NEXT_PUBLIC_INSFORGE_URL: z
    .string()
    .url('NEXT_PUBLIC_INSFORGE_URL must be a valid URL'),
  NEXT_PUBLIC_INSFORGE_ANON_KEY: z
    .string()
    .min(10, 'NEXT_PUBLIC_INSFORGE_ANON_KEY is missing or too short'),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;

  const result = envSchema.safeParse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_INSFORGE_URL: process.env.NEXT_PUBLIC_INSFORGE_URL,
    NEXT_PUBLIC_INSFORGE_ANON_KEY: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
  });

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    const message = `\n❌ Environment variable validation failed:\n${missing}\n\nPlease check your .env.local file.\n`;
    console.error(message);
    // In edge runtime we can't throw synchronously during module init,
    // so we return a partial object and let individual calls fail gracefully
    _env = {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      NEXT_PUBLIC_INSFORGE_URL: process.env.NEXT_PUBLIC_INSFORGE_URL || '',
      NEXT_PUBLIC_INSFORGE_ANON_KEY:
        process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '',
    };
    return _env;
  }

  _env = result.data;
  return _env;
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  getEnv();
}
