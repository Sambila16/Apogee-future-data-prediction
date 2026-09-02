import { useEffect, useState } from 'react';
import { Plus, Brain, Play, X, Trash2, FlaskConical, History, ChevronDown } from 'lucide-react';
import {
  listModels,
  listPrebuilt,
  createModel,
  runModel,
  deleteModel,
  listDataSources,
  listModelRuns,
  type ModelItem,
  type PrebuiltModel,
  type DataSourceItem,
  type ModelRunItem,
} from '@/lib/api';

type LastRunInfo = {
  is_simulated: boolean;
  mae?: number | null;
  mape?: number | null;
  status: string;
  result_summary?: string;
};

const MODEL_TYPES = [
  { value: 'time_series', label: 'Time series' },
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Regression' },
  { value: 'scenario', label: 'Scenario' },
  { value: 'reasoning', label: 'Reasoning' },
];

export default function Models() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [prebuilt, setPrebuilt] = useState<PrebuiltModel[]>([]);
  const [dataSources, setDataSources] = useState<DataSourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'prebuilt' | 'custom'>('prebuilt');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [lastRuns, setLastRuns] = useState<Record<number, LastRunInfo>>({});
  const [historyOpenId, setHistoryOpenId] = useState<number | null>(null);
  const [historyById, setHistoryById] = useState<Record<number, ModelRunItem[]>>({});
  const [historyLoading, setHistoryLoading] = useState<number | null>(null);

  // form
  const [name, setName] = useState('');
  const [modelType, setModelType] = useState('time_series');
  const [target, setTarget] = useState('');
  const [selectedPrebuilt, setSelectedPrebuilt] = useState<string>('');
  const [dataSourceId, setDataSourceId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [m, p, d] = await Promise.all([listModels(), listPrebuilt(), listDataSources()]);
      setModels(m);
      setPrebuilt(p);
      setDataSources(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load models');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (tab === 'prebuilt') {
        if (!selectedPrebuilt) throw new Error('Select a pre-built model');
        const pb = prebuilt.find((x) => x.key === selectedPrebuilt);
        await createModel({
          name: name || pb?.name || 'New model',
          model_type: pb?.model_type || 'time_series',
          origin: 'prebuilt',
          template_key: selectedPrebuilt,
          target_metric: target || pb?.target_metric,
          description: pb?.description,
          data_source_id: dataSourceId ? Number(dataSourceId) : undefined,
        });
      } else {
        await createModel({
          name,
          model_type: modelType,
          origin: 'custom',
          target_metric: target || undefined,
          data_source_id: dataSourceId ? Number(dataSourceId) : undefined,
        });
      }
      setOpen(false);
      setName('');
      setTarget('');
      setSelectedPrebuilt('');
      setDataSourceId('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create model');
    } finally {
      setSaving(false);
    }
  }

  async function handleRun(id: number) {
    setBusyId(id);
    try {
      const result = await runModel(id);
      setLastRuns((prev) => ({
        ...prev,
        [id]: {
          is_simulated: result.is_simulated,
          mae: result.mae,
          mape: result.mape,
          status: result.status,
          result_summary: result.result_summary,
        },
      }));
      setHistoryById((prev) => {
        const next = { ...prev };
        delete next[id]; // invalidate cached history so it refetches with the new run
        return next;
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Run failed');
    } finally {
      setBusyId(null);
    }
  }

  async function toggleHistory(id: number) {
    if (historyOpenId === id) {
      setHistoryOpenId(null);
      return;
    }
    setHistoryOpenId(id);
    if (!historyById[id]) {
      setHistoryLoading(id);
      try {
        const runs = await listModelRuns(id);
        setHistoryById((prev) => ({ ...prev, [id]: runs }));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load run history');
      } finally {
        setHistoryLoading(null);
      }
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this model?')) return;
    try {
      await deleteModel(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div className="p-5 sm:p-8 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Models</h1>
          <p className="text-white/50 text-[14px]">Create, train, and run predictive & reasoning models.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-[42px] px-4 bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[14px] font-[450] flex items-center gap-2 hover:opacity-90 self-start"
        >
          <Plus className="w-4 h-4" /> New model
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-[12px] bg-red-500/15 border border-red-500/30 text-red-300 text-[13px]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-white/50 text-[14px]">Loading models…</p>
      ) : models.length === 0 ? (
        <div className="p-10 rounded-[16px] border border-dashed border-white/15 text-center">
          <p className="text-white/60 text-[15px] mb-3">No models yet</p>
          <p className="text-white/40 text-[13px] mb-5">Add a pre-built model or create a custom one.</p>
          <button
            onClick={() => setOpen(true)}
            className="h-[40px] px-4 bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[13px] font-[450]"
          >
            New model
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {models.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-white text-[15px] font-[450]">{m.name}</h3>
                    <p className="text-white/45 text-[12px]">
                      {m.model_type.replace('_', ' ')} · {m.origin}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    m.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : m.status === 'draft'
                        ? 'bg-white/10 text-white/50'
                        : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/50">
                  <span>Accuracy: {m.accuracy != null ? `${Number(m.accuracy).toFixed(1)}%` : '—'}</span>
                  <span>
                    {m.runs_count} {m.runs_count === 1 ? 'run' : 'runs'}
                  </span>
                  {lastRuns[m.id] && !lastRuns[m.id].is_simulated && lastRuns[m.id].mae != null && (
                    <span>MAE: {lastRuns[m.id].mae}</span>
                  )}
                  {lastRuns[m.id] && !lastRuns[m.id].is_simulated && lastRuns[m.id].mape != null && (
                    <span>MAPE: {lastRuns[m.id].mape}%</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRun(m.id)}
                    disabled={busyId === m.id}
                    className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" /> {busyId === m.id ? 'Running…' : 'Run'}
                  </button>
                  <button
                    onClick={() => toggleHistory(m.id)}
                    className="flex items-center gap-1 text-white/50 hover:text-white transition-colors"
                    title="Run history"
                  >
                    <History className="w-3.5 h-3.5" />
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${historyOpenId === m.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-white/40 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {lastRuns[m.id]?.is_simulated && (
                <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-amber-300/90 text-[12px] leading-snug">
                    Simulated result — {lastRuns[m.id].result_summary || 'no real data was used for this run.'}
                  </p>
                </div>
              )}
              {lastRuns[m.id] && !lastRuns[m.id].is_simulated && lastRuns[m.id].status === 'completed' && (
                <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-emerald-300/90 text-[12px] leading-snug">
                    Trained on real data — {lastRuns[m.id].result_summary}
                  </p>
                </div>
              )}
              {lastRuns[m.id]?.status === 'failed' && (
                <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-red-500/10 border border-red-500/20 px-3 py-2">
                  <FlaskConical className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-300/90 text-[12px] leading-snug">{lastRuns[m.id].result_summary}</p>
                </div>
              )}

              {historyOpenId === m.id && (
                <div className="mt-3 rounded-[10px] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
                  {historyLoading === m.id ? (
                    <p className="px-3 py-2.5 text-white/40 text-[12px]">Loading history…</p>
                  ) : !historyById[m.id] || historyById[m.id].length === 0 ? (
                    <p className="px-3 py-2.5 text-white/40 text-[12px]">No runs yet.</p>
                  ) : (
                    historyById[m.id].map((run) => (
                      <div key={run.id} className="px-3 py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              run.status === 'failed'
                                ? 'bg-red-400'
                                : run.is_simulated
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                            }`}
                          />
                          <span className="text-white/60 text-[11px] shrink-0">
                            {new Date(run.created_at).toLocaleString()}
                          </span>
                          <span className="text-white/35 text-[11px] truncate">
                            {run.is_simulated ? 'simulated' : 'real'} · {run.status}
                          </span>
                        </div>
                        <span className="text-white/70 text-[12px] shrink-0">
                          {run.accuracy != null ? `${run.accuracy.toFixed(1)}%` : '—'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-[520px] rounded-[20px] bg-[#12131c] border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white text-[18px] font-[450]">New model</h2>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={() => setTab('prebuilt')}
                className={`flex-1 h-[40px] rounded-[10px] text-[13px] font-[450] ${
                  tab === 'prebuilt' ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50'
                }`}
              >
                Pre-built
              </button>
              <button
                type="button"
                onClick={() => setTab('custom')}
                className={`flex-1 h-[40px] rounded-[10px] text-[13px] font-[450] ${
                  tab === 'custom' ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50'
                }`}
              >
                Custom
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {tab === 'prebuilt' ? (
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {prebuilt.map((p) => (
                    <label
                      key={p.key}
                      className={`block p-3 rounded-[12px] border cursor-pointer transition-colors ${
                        selectedPrebuilt === p.key
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="prebuilt"
                        className="sr-only"
                        checked={selectedPrebuilt === p.key}
                        onChange={() => {
                          setSelectedPrebuilt(p.key);
                          setName(p.name);
                          setTarget(p.target_metric);
                        }}
                      />
                      <p className="text-white text-[14px] font-[450]">{p.name}</p>
                      <p className="text-white/45 text-[12px] mt-0.5">{p.description}</p>
                    </label>
                  ))}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-white/60 text-[12px] mb-1.5">Model name</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none focus:border-white/25"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[12px] mb-1.5">Type</label>
                    <select
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value)}
                      className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none"
                    >
                      {MODEL_TYPES.map((t) => (
                        <option key={t.value} value={t.value} className="bg-[#12131c]">
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-white/60 text-[12px] mb-1.5">
                  {tab === 'prebuilt' ? 'Name (optional override)' : 'Target metric'}
                </label>
                <input
                  value={tab === 'prebuilt' ? name : target}
                  onChange={(e) => (tab === 'prebuilt' ? setName(e.target.value) : setTarget(e.target.value))}
                  placeholder={tab === 'custom' ? 'e.g. Revenue, Churn' : ''}
                  className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none focus:border-white/25"
                />
              </div>

              <div>
                <label className="block text-white/60 text-[12px] mb-1.5">Data source (optional)</label>
                <select
                  value={dataSourceId}
                  onChange={(e) => setDataSourceId(e.target.value)}
                  className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none"
                >
                  <option value="" className="bg-[#12131c]">
                    No data source — will simulate on run
                  </option>
                  {dataSources.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#12131c]">
                      {d.name} ({d.source_type})
                    </option>
                  ))}
                </select>
                {dataSources.length === 0 && (
                  <p className="text-white/40 text-[12px] mt-1.5">
                    No data sources connected yet — add one from the Data Sources page to train for real.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || (tab === 'prebuilt' && !selectedPrebuilt)}
                className="w-full h-[46px] bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[14px] font-[450] hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create model'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
