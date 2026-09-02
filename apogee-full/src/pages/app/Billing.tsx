import { useEffect, useState } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { getSubscription, listInvoices, type SubscriptionInfo, type InvoiceItem } from '@/lib/api';

export default function Billing() {
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getSubscription(), listInvoices()])
      .then(([s, inv]) => {
        setSub(s);
        setInvoices(inv);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load billing info'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-5 sm:p-8 max-w-[800px]">
      <div className="mb-8">
        <h1 className="text-white text-[24px] sm:text-[28px] font-[450] mb-1">Billing</h1>
        <p className="text-white/50 text-[14px]">Manage your subscription and invoices.</p>
      </div>

      {error && <p className="text-red-300 text-[13px] mb-4">{error}</p>}
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading…</p>
      ) : (
        <>
          <div className="p-6 rounded-[16px] bg-white/[0.04] border border-white/[0.06] mb-5">
            {!sub ? (
              <p className="text-white/50 text-[14px]">No subscription found for your organization.</p>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white/50 text-[12px] mb-1">Current plan</p>
                  <p className="text-white text-[20px] font-[450] capitalize">{sub.plan}</p>
                  <p className="text-white/50 text-[13px] mt-1">
                    {sub.currency} {sub.amount.toFixed(2)} / month · {sub.status}
                    {sub.renews_at && ` · Renews ${new Date(sub.renews_at).toLocaleDateString()}`}
                  </p>
                </div>
                <button className="h-[40px] px-4 rounded-[10px] border border-white/20 text-white text-[13px] font-[450] hover:bg-white/5 self-start">
                  Change plan
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/[0.06]">
              <CreditCard className="w-4 h-4 text-white/50" />
              <span className="text-white/45 text-[13px]">
                No payment method on file — card details aren't collected yet.
              </span>
            </div>
          </div>

          <div className="rounded-[16px] border border-white/[0.06] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <h2 className="text-white text-[14px] font-[450]">Invoices</h2>
            </div>
            {invoices.length === 0 ? (
              <p className="px-5 py-6 text-white/45 text-[13px]">No invoices yet.</p>
            ) : (
              invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04] last:border-0"
                >
                  <div>
                    <p className="text-white text-[14px]">{new Date(inv.invoice_date).toLocaleDateString()}</p>
                    <p className="text-white/45 text-[12px] capitalize">{inv.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white text-[14px]">${inv.amount.toFixed(2)}</span>
                    <button className="text-white/40 hover:text-white">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
