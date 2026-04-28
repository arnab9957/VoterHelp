import { insforge } from '@/lib/insforge';

export const runtime = 'edge';

// Simple admin guard — in production replace with real auth token check
function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return true; // Open if no token configured (dev mode)
  return authHeader === `Bearer ${adminToken}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Total query count
    const { count: totalCount } = await insforge.database
      .from('user_interactions')
      .select('*', { count: 'exact', head: true });

    // Breakdown by state/location
    const { data: byState } = await insforge.database
      .from('user_interactions')
      .select('location')
      .order('location');

    // Breakdown by language
    const { data: byLanguage } = await insforge.database
      .from('user_interactions')
      .select('language')
      .order('language');

    // Recent 10 interactions
    const { data: recent } = await insforge.database
      .from('user_interactions')
      .select('id, location, role, query, language, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Aggregate counts client-side (InsForge doesn't support GROUP BY via SDK)
    const stateCounts = byState?.reduce<Record<string, number>>((acc, row) => {
      const key = row.location || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}) ?? {};

    const languageCounts = byLanguage?.reduce<Record<string, number>>((acc, row) => {
      const key = row.language || 'English';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}) ?? {};

    // Error log count
    let errorCount = 0;
    try {
      const { count } = await insforge.database
        .from('error_logs')
        .select('*', { count: 'exact', head: true });
      errorCount = count ?? 0;
    } catch {
      // Table may not exist yet
    }

    return Response.json({
      totalInteractions: totalCount ?? 0,
      errorCount,
      byState: Object.entries(stateCounts)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count),
      byLanguage: Object.entries(languageCounts)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count),
      recentInteractions: recent ?? [],
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return Response.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
