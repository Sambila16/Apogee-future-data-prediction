import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Database, Brain, ArrowUpRight } from 'lucide-react';
import { fetchDashboard, listModels, type DashboardStats, type ModelItem } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchDashboard(), listModels()])
      .then(([s, m]) => {
        setStats(s);
        setModels(m.slice(0, 5));
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  const cards = [
    { label: 'Models', value: stats?.models_count ?? '—', sub: `${stats?.active_models ?? 0} active` },
    { label: 'Data sources', value: stats?.data_sources_count ?? '—', sub: 'Connected' },
    { label: 'Workspaces', value: stats?.workspaces_count ?? '—', sub: 'Projects' },
    { label: 'Team', value: stats?.team_count ?? '—', sub: 'Members' },
  ];

  return (
    <div className="p-5 sm:p-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Dashboard</h1>
        <p className="text-white/50 text-[14px]">Overview of your organization in Apogee.</p>
      </div>

      {error && <p className="text-red-300 text-[13px] mb-4">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((s) => (
          <div key={s.label} className="p-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06]">
            <p className="text-white/50 text-[12px] mb-2">{s.label}</p>
            <p className="text-white text-[22px] sm:text-[26px] font-[450] mb-1">{s.value}</p>
            <p className="text-[12px] text-white/40">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="p-6 rounded-[16px] bg-white/[0.04] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-[16px] font-[450]">Recent models</h2>
            <Link to="/app/models" className="text-white/50 text-[13px] hover:text-white flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {models.length === 0 ? (
            <p className="text-white/45 text-[14px]">No models yet. Create one from the Models page.</p>
          ) : (
            <ul className="space-y-3">
              {models.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-white/85">{m.name}</span>
                  <span className="text-white/40 capitalize">{m.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid sm:grid-cols-1 gap-3 content-start">
          {[
            { to: '/app/data-sources', icon: Database, label: 'Connect data', desc: 'Add a new source' },
            { to: '/app/models', icon: Brain, label: 'New model', desc: 'Pre-built or custom' },
            { to: '/app/analytics', icon: TrendingUp, label: 'Analytics', desc: 'Explore results' },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="flex items-center gap-4 p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center">
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-[14px] font-[450]">{a.label}</p>
                <p className="text-white/45 text-[12px]">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
