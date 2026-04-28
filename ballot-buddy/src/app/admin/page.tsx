"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type StatsData = {
  totalInteractions: number;
  errorCount: number;
  byState: { state: string; count: number }[];
  byLanguage: { language: string; count: number }[];
  recentInteractions: {
    id: string;
    location: string;
    role: string;
    query: string;
    language: string;
    created_at: string;
  }[];
};

function StatCard({
  label,
  value,
  icon,
  color = "indigo",
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-${color}-500/20`}
      >
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function BarChart({
  data,
  label,
}: {
  data: { name: string; count: number }[];
  label: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {label}
      </h3>
      <div className="space-y-3">
        {data.slice(0, 8).map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-24 text-xs text-gray-300 truncate text-right shrink-0">
              {item.name}
            </div>
            <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <div className="w-8 text-xs text-gray-400 text-right shrink-0">
              {item.count}
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No data yet</p>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setStats(data);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center gap-1 mb-2"
            >
              ← Back to App
            </Link>
            <h1 className="text-3xl font-bold">
              🗳️ Ballot Buddy{" "}
              <span className="text-indigo-400">Analytics</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes
              every 30s
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading…
              </>
            ) : (
              <>↻ Refresh</>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400">
            ⚠️ Failed to load stats: {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Interactions"
            value={stats?.totalInteractions ?? "—"}
            icon="💬"
            color="indigo"
          />
          <StatCard
            label="Unique States"
            value={stats?.byState.length ?? "—"}
            icon="🗺️"
            color="purple"
          />
          <StatCard
            label="Languages Used"
            value={stats?.byLanguage.length ?? "—"}
            icon="🌐"
            color="emerald"
          />
          <StatCard
            label="Error Events"
            value={stats?.errorCount ?? "—"}
            icon="⚠️"
            color="red"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <BarChart
            label="Queries by State"
            data={(stats?.byState ?? []).map((s) => ({
              name: s.state,
              count: s.count,
            }))}
          />
          <BarChart
            label="Queries by Language"
            data={(stats?.byLanguage ?? []).map((l) => ({
              name: l.language,
              count: l.count,
            }))}
          />
        </div>

        {/* Recent interactions table */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Recent Interactions
          </h3>
          {(stats?.recentInteractions ?? []).length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No interactions recorded yet. Start chatting!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-white/5">
                    <th className="text-left pb-3 pr-4 font-medium">Time</th>
                    <th className="text-left pb-3 pr-4 font-medium">
                      Location
                    </th>
                    <th className="text-left pb-3 pr-4 font-medium">Role</th>
                    <th className="text-left pb-3 pr-4 font-medium">Lang</th>
                    <th className="text-left pb-3 font-medium">Query</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats?.recentInteractions.map((row) => (
                    <tr key={row.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-indigo-300">
                        {row.location}
                      </td>
                      <td className="py-3 pr-4 text-gray-300">{row.role}</td>
                      <td className="py-3 pr-4 text-gray-300">
                        {row.language}
                      </td>
                      <td
                        className="py-3 text-gray-200 max-w-xs truncate"
                        title={row.query}
                      >
                        {row.query}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
