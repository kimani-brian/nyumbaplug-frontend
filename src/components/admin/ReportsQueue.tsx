import React from 'react';
import { Flag, CheckCircle, ShieldAlert, UserX } from 'lucide-react';
import { PropertyReport } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  reports: PropertyReport[];
  onResolve: (reportId: string) => void;
  onRevokeAgent: (report: PropertyReport) => void;
}

export const ReportsQueue: React.FC<Props> = ({ reports, onResolve, onRevokeAgent }) => {
  const unresolved = reports.filter(r => !r.resolved);
  const resolved = reports.filter(r => r.resolved);

  return (
    <div className="bg-white rounded-2xl border border-nyumba-line shadow-soft overflow-hidden">
      <div className="p-5 bg-nyumba-navy text-white flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Flag size={18} className="text-red-400" />
          Scam Reports Queue
        </h3>
        <span className="text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-full font-mono">
          {unresolved.length} OPEN
        </span>
      </div>

      {unresolved.length === 0 && resolved.length === 0 ? (
        <EmptyState title="No reports" description="All clear — no scam reports have been submitted." />
      ) : (
        <div className="divide-y divide-nyumba-line">
          {unresolved.length === 0 && (
            <div className="p-6 text-center text-xs text-emerald-600 font-medium">All reports resolved.</div>
          )}
          {unresolved.map(rep => (
            <div key={rep.id} className="p-5 space-y-3 hover:bg-slate-50/60 transition">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-sm text-nyumba-ink line-clamp-1">{rep.property_name || 'Property'}</span>
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-semibold shrink-0">Pending</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(rep.created_at).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-red-700 font-semibold">{rep.reason}</p>
              {rep.details && (
                <p className="text-xs text-slate-600 leading-relaxed bg-nyumba-cream border border-nyumba-line rounded-xl p-3 italic">
                  “{rep.details}”
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-nyumba-line">
                <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
                  <UserX size={13} className="text-slate-400 shrink-0" />
                  <span className="line-clamp-1">
                    Agent: <strong className="text-nyumba-ink">{rep.landlord_name || 'Unknown'}</strong>
                  </span>
                  {rep.tenant_phone && (
                    <span className="hidden sm:inline text-slate-400">
                      · reported by <strong className="text-slate-500">{rep.tenant_phone}</strong>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {rep.landlord_id && (
                    <button
                      onClick={() => onRevokeAgent(rep)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      <ShieldAlert size={12} />
                      Revoke agent's listings
                    </button>
                  )}
                  <button
                    onClick={() => onResolve(rep.id)}
                    className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                  >
                    <CheckCircle size={12} />
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
          {resolved.length > 0 && (
            <details className="p-4">
              <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 font-medium">
                Resolved ({resolved.length})
              </summary>
              <div className="mt-2 space-y-2">
                {resolved.map(rep => (
                  <div key={rep.id} className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    <span className="line-clamp-1">
                      {rep.property_name || 'Property'} — {rep.reason}
                      {rep.landlord_name ? ` (${rep.landlord_name})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
};
