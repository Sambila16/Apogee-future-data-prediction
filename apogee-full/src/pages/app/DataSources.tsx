import { useEffect, useRef, useState } from 'react';
import { Plus, Database, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { listDataSources, createDataSource, uploadDataRecords, type DataSourceItem } from '@/lib/api';

const TYPES = ['crm', 'database', 'analytics', 'payments', 'warehouse'];

export default function DataSources() {
  const [items, setItems] = useState<DataSourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [sourceType, setSourceType] = useState('database');
  const [error, setError] = useState('');
  const [uploadMsg, setUploadMsg] = useState<Record<number, string>>({});
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  async function load() {
    setLoading(true);
    try {
      setItems(await listDataSources());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createDataSource({ name, source_type: sourceType });
      setOpen(false);
      setName('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  }

  async function handleFileSelected(sourceId: number, file: File | undefined) {
    if (!file) return;
    setUploadingId(sourceId);
    setUploadMsg((prev) => ({ ...prev, [sourceId]: '' }));
    try {
      const result = await uploadDataRecords(sourceId, file);
      setUploadMsg((prev) => ({
        ...prev,
        [sourceId]: `Imported ${result.rows_imported} rows${result.rows_skipped ? `, skipped ${result.rows_skipped}` : ''}.`,
      }));
      await load();
    } catch (e) {
      setUploadMsg((prev) => ({
        ...prev,
        [sourceId]: e instanceof Error ? e.message : 'Upload failed',
      }));
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="p-5 sm:p-8 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Data Sources</h1>
          <p className="text-white/50 text-[14px]">Connect and manage the data that powers your models.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-[42px] px-4 bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[14px] font-[450] flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Add source
        </button>
      </div>

      {error && <p className="text-red-300 text-[13px] mb-4">{error}</p>}
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading…</p>
      ) : (
        <div className="rounded-[16px] border border-white/[0.06] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-5 py-3 text-white/50 text-[12px] font-[450]">Source</th>
                <th className="px-5 py-3 text-white/50 text-[12px] font-[450] hidden sm:table-cell">Type</th>
                <th className="px-5 py-3 text-white/50 text-[12px] font-[450]">Status</th>
                <th className="px-5 py-3 text-white/50 text-[12px] font-[450]">Historical data</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-white/45 text-[14px]">
                    No data sources yet.
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id} className="border-b border-white/[0.04]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[8px] bg-white/10 flex items-center justify-center">
                          <Database className="w-4 h-4 text-white/70" />
                        </div>
                        <span className="text-white text-[14px] font-[450]">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-[13px] hidden sm:table-cell">{s.source_type}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[13px]">
                        {s.status === 'healthy' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span className={s.status === 'healthy' ? 'text-emerald-400/90' : 'text-amber-400/90'}>
                          {s.status === 'healthy' ? 'Healthy' : s.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <input
                        ref={(el) => (fileInputs.current[s.id] = el)}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFileSelected(s.id, e.target.files?.[0])}
                      />
                      <button
                        onClick={() => fileInputs.current[s.id]?.click()}
                        disabled={uploadingId === s.id}
                        className="inline-flex items-center gap-1.5 text-[12px] text-white/70 hover:text-white border border-white/15 rounded-[8px] px-2.5 py-1.5 disabled:opacity-50"
                      >
                        <Upload className="w-3 h-3" />
                        {uploadingId === s.id ? 'Uploading…' : 'Upload CSV'}
                      </button>
                      {uploadMsg[s.id] && <p className="text-white/45 text-[11px] mt-1">{uploadMsg[s.id]}</p>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <form onSubmit={handleCreate} className="relative w-full max-w-[400px] rounded-[20px] bg-[#12131c] border border-white/10 p-6 space-y-4">
            <h2 className="text-white text-[18px] font-[450]">Add data source</h2>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Salesforce, Postgres"
              className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none"
            />
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px]"
            >
              {TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#12131c]">
                  {t}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full h-[44px] bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[14px] font-[450]">
              Connect
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
