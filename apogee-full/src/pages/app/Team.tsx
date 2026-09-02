import { useEffect, useState } from 'react';
import { listTeam, type TeamMemberItem } from '@/lib/api';

export default function Team() {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listTeam()
      .then(setMembers)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-5 sm:p-8 max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Team</h1>
        <p className="text-white/50 text-[14px]">Members of your organization.</p>
      </div>
      {error && <p className="text-red-300 text-[13px] mb-4">{error}</p>}
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading…</p>
      ) : (
        <div className="rounded-[16px] border border-white/[0.06] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-5 py-3 text-white/50 text-[12px]">Member</th>
                <th className="px-5 py-3 text-white/50 text-[12px] hidden sm:table-cell">Role</th>
                <th className="px-5 py-3 text-white/50 text-[12px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-white/[0.04]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-[12px] font-[450]">
                        {m.user.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-[14px] font-[450]">{m.user.full_name}</p>
                        <p className="text-white/45 text-[12px]">{m.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-[13px] hidden sm:table-cell capitalize">{m.role}</td>
                  <td className="px-5 py-4">
                    <span className="text-[12px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 capitalize">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
