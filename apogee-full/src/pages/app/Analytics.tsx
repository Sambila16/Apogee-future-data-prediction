import { useEffect, useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { getAnalytics, type AnalyticsData } from '@/lib/api';

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const maxVal =
    data && data.revenue_series.length
      ? Math.max(...data.revenue_series.flatMap((p) => [p.actual ?? 0, p.predicted ?? 0]))
      : 0;

  return (
    <div className="p-5 sm:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Analytics</h1>
          <p className="text-white/50 text-[14px]">Deep analysis, reports, and exports from your models and data.</p>
        </div>
        <button className="h-[42px] px-4 rounded-[10px] border border-white/20 text-white text-[14px] font-[450] flex items-center gap-2 hover:bg-white/5 self-start">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {error && <p className="text-red-300 text-[13px] mb-4">{error}</p>}
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading…</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          <div className="p-6 rounded-[16px] bg-white/[0.04] border border-white/[0.06]">
            <h2 className="text-white text-[15px] font-[450] mb-4">Revenue vs Forecast</h2>
            {!data?.has_real_forecast ? (
              <div className="h-[220px] flex flex-col items-center justify-center text-center gap-2">
                <TrendingUp className="w-6 h-6 text-white/25" />
                <p className="text-white/45 text-[13px] max-w-[280px]">
                  No trained time-series model yet. Create a Revenue Forecast model with a connected data source and
                  run it to see this chart.
                </p>
              </div>
            ) : (
              <div className="h-[220px] flex items-end gap-1.5">
                {data.revenue_series.map((p, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-0.5" title={p.date}>
                    {p.actual != null && (
                      <div
                        className="rounded-t-[2px] bg-white/25"
                        style={{ height: `${maxVal ? (p.actual / maxVal) * 100 : 0}%` }}
                      />
                    )}
                    {p.predicted != null && (
                      <div
                        className="rounded-t-[2px] bg-white/80"
                        style={{ height: `${maxVal ? (p.predicted / maxVal) * 100 : 0}%` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            {data?.has_real_forecast && (
              <div className="flex items-center gap-4 mt-3 text-[11px] text-white/45">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-white/25" /> Actual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-white/80" /> Predicted
                </span>
              </div>
            )}
          </div>

          <div className="p-6 rounded-[16px] bg-white/[0.04] border border-white/[0.06]">
            <h2 className="text-white text-[15px] font-[450] mb-4">Model performance</h2>
            {!data || data.model_performance.length === 0 ? (
              <p className="text-white/45 text-[13px]">No models yet.</p>
            ) : (
              <div className="space-y-4">
                {data.model_performance.map((m) => (
                  <div key={m.id}>
                    <div className="flex justify-between text-[13px] mb-1.5">
                      <span className="text-white/70 flex items-center gap-2">
                        {m.name}
                        {m.is_simulated && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                            simulated
                          </span>
                        )}
                      </span>
                      <span className="text-white">{m.accuracy != null ? `${m.accuracy.toFixed(1)}%` : '—'}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.is_simulated ? 'bg-amber-400/60' : 'bg-white/70'}`}
                        style={{ width: `${m.accuracy ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-6 rounded-[16px] bg-white/[0.04] border border-white/[0.06]">
        <h2 className="text-white text-[15px] font-[450] mb-3">Reports</h2>
        <p className="text-white/50 text-[14px]">
          Scheduled and one-off reports will appear here. Connect this view to your reporting pipeline.
        </p>
      </div>
    </div>
  );
}
