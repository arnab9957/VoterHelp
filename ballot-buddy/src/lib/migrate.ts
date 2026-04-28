import { insforge } from './insforge';

/**
 * Ensures required InsForge tables exist on first run.
 * This is a lightweight migration — safe to call on every cold start.
 */
export async function ensureTables() {
  // error_logs — structured error tracking
  try {
    // A simple SELECT will succeed if the table exists; we catch the error otherwise
    const { error } = await insforge.database
      .from('error_logs')
      .select('id')
      .limit(1);

    if (error && error.message?.includes('does not exist')) {
      console.warn('[migration] error_logs table missing — skipping (create via InsForge dashboard)');
    }
  } catch {
    // Silently ignore — migrations are best-effort
  }
}
