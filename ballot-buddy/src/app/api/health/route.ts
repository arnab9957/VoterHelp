export const runtime = 'edge';

export async function GET() {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  const hasInsforgeUrl = Boolean(process.env.NEXT_PUBLIC_INSFORGE_URL);
  const hasInsforgeKey = Boolean(process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY);

  const allConfigured = hasGeminiKey && hasInsforgeUrl && hasInsforgeKey;

  return Response.json(
    {
      status: allConfigured ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      services: {
        gemini: hasGeminiKey ? 'configured' : 'missing_key',
        insforge: hasInsforgeUrl && hasInsforgeKey ? 'configured' : 'missing_config',
      },
    },
    {
      status: allConfigured ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
