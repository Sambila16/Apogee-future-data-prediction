import { Plug } from 'lucide-react';

// None of these are wired to real OAuth/API connections yet — each one
// needs its own developer account and credentials before it can go live.
// Shown honestly as "Not connected" rather than faking a connected state.
const INTEGRATIONS = [
  { name: 'Salesforce', category: 'CRM' },
  { name: 'HubSpot', category: 'CRM' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'Google BigQuery', category: 'Data warehouse' },
  { name: 'Snowflake', category: 'Data warehouse' },
  { name: 'Slack', category: 'Notifications' },
  { name: 'Segment', category: 'CDP' },
  { name: 'PostgreSQL', category: 'Database' },
];

export default function Integrations() {
  return (
    <div className="p-5 sm:p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Integrations</h1>
        <p className="text-white/50 text-[14px]">Connect Apogee to the tools your team already uses.</p>
      </div>

      <div className="mb-6 px-4 py-3 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-white/50 text-[13px]">
        None of these are connected yet. In the meantime, you can bring in historical data manually via CSV upload
        on the Data Sources page.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTEGRATIONS.map((i) => (
          <div
            key={i.name}
            className="p-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center">
                <Plug className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-white text-[14px] font-[450]">{i.name}</p>
                <p className="text-white/45 text-[12px]">{i.category}</p>
              </div>
            </div>
            <span className="text-[12px] px-3 py-1.5 rounded-[8px] border border-white/10 text-white/35">
              Not connected
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
