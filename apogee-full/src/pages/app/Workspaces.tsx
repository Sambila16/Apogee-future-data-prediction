import { useEffect, useState } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { listWorkspaces, createWorkspace, type WorkspaceItem } from '@/lib/api';

export default function Workspaces() {
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setItems(await listWorkspaces());
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
      await createWorkspace({ name });
      setName('');
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  }

  return (
    <div className="p-5 sm:p-8 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Workspaces</h1>
          <p className="text-white/50 text-[14px]">Organize projects and collaborate with your team.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-[42px] px-4 bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[14px] font-[450] flex items-center gap-2 hover:opacity-90 self-start"
        >
          <Plus className="w-4 h-4" /> New workspace
        </button>
      </div>

      {error && <p className="text-red-300 text-[13px] mb-4">{error}</p>}
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-white/50 text-[14px]">No workspaces yet. Create one to get started.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((w) => (
            <div key={w.id} className="p-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-white text-[16px] font-[450]">{w.name}</h3>
                  <p className="text-white/45 text-[12px] mt-0.5">
                    Updated {new Date(w.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-white/50 text-[13px]">{w.models_count} models</p>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <form
            onSubmit={handleCreate}
            className="relative w-full max-w-[400px] rounded-[20px] bg-[#12131c] border border-white/10 p-6 space-y-4"
          >
            <h2 className="text-white text-[18px] font-[450]">New workspace</h2>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workspace name"
              className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none"
            />
            <button type="submit" className="w-full h-[44px] bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[14px] font-[450]">
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
