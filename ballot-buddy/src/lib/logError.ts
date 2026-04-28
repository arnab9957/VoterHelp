import { insforge } from './insforge';

interface LogErrorOptions {
  route: string;
  error: unknown;
  context?: Record<string, unknown>;
}

export async function logError({ route, error, context }: LogErrorOptions) {
  const message =
    error instanceof Error ? error.message : String(error);
  const stack =
    error instanceof Error ? (error.stack ?? '') : '';

  try {
    await insforge.database.from('error_logs').insert([
      {
        route,
        error_message: message,
        stack: stack.slice(0, 4000), // cap to avoid oversized payloads
        context: context ?? {},
      },
    ]);
  } catch (dbErr) {
    // Never let logging failures surface to the user
    console.error('[logError] Failed to write to error_logs:', dbErr);
  }
}
