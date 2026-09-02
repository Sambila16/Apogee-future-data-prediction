import { useEffect, useState } from 'react';
import { getMe, updateMe, updateOrganization, type MeResponse } from '@/lib/api';

export default function Settings() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setMe(data);
        setFullName(data.user.full_name);
        setCompany(data.user.company || '');
        setOrgName(data.organization.name);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await updateMe({ full_name: fullName, company });
      if (me?.role === 'admin' && orgName !== me.organization.name) {
        await updateOrganization({ name: orgName });
      }
      const refreshed = await getMe();
      setMe(refreshed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-5 sm:p-8 max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Settings</h1>
        <p className="text-white/50 text-[14px]">Profile, preferences, and account security.</p>
      </div>

      {error && <p className="text-red-300 text-[13px] mb-4">{error}</p>}
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading…</p>
      ) : (
        <form className="space-y-6" onSubmit={handleSave}>
          <section className="p-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06] space-y-4">
            <h2 className="text-white text-[15px] font-[450]">Profile</h2>
            <div>
              <label className="block text-white/60 text-[12px] mb-1.5">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none focus:border-white/25"
              />
            </div>
            <div>
              <label className="block text-white/60 text-[12px] mb-1.5">Email</label>
              <input
                value={me?.user.email || ''}
                disabled
                className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.03] border border-white/10 text-white/50 text-[14px] cursor-not-allowed"
              />
              <p className="text-white/35 text-[11px] mt-1">Email changes aren't supported yet.</p>
            </div>
            <div>
              <label className="block text-white/60 text-[12px] mb-1.5">Personal company field</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-[14px] focus:outline-none focus:border-white/25"
              />
            </div>
          </section>

          <section className="p-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06] space-y-4">
            <h2 className="text-white text-[15px] font-[450]">Organization</h2>
            <div>
              <label className="block text-white/60 text-[12px] mb-1.5">Organization name</label>
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={me?.role !== 'admin'}
                className={`w-full h-[44px] px-3 rounded-[10px] border border-white/10 text-[14px] focus:outline-none focus:border-white/25 ${
                  me?.role !== 'admin' ? 'bg-white/[0.03] text-white/50 cursor-not-allowed' : 'bg-white/[0.06] text-white'
                }`}
              />
              {me?.role !== 'admin' && (
                <p className="text-white/35 text-[11px] mt-1">Only organization admins can rename the organization.</p>
              )}
            </div>
            <p className="text-white/45 text-[12px]">
              Plan: <span className="capitalize">{me?.organization.plan}</span>
            </p>
          </section>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="h-[44px] px-5 bg-[#E9E9E9] rounded-[10px] text-[#0A0707] text-[14px] font-[450] hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {saved && <span className="text-emerald-400 text-[13px]">Saved.</span>}
          </div>
        </form>
      )}
    </div>
  );
}
