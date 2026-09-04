import React from 'react';
import { FlagIcon, CheckCircleIcon, ShieldAlertIcon, PersonOffIcon } from '../../utils/icons';
import { PropertyReport } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  reports: PropertyReport[];
  onResolve: (reportId: string) => void;
  onRevokeManager: (report: PropertyReport) => void;
}

export const ReportsQueue: React.FC<Props> = ({ reports, onResolve, onRevokeManager }) => {
  const unresolved = reports.filter(r => !r.resolved);
  const resolved = reports.filter(r => r.resolved);

  return (
    <div className="bg-panel rounded-2xl border border-line shadow-soft overflow-hidden">
      <div className="p-5 bg-panel border-b border-line flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <FlagIcon size={18} className="text-red-400" />
          Scam Reports Queue
        </h3>
        <span className="text-xs bg-panel-strong text-fg/80 px-2.5 py-1 rounded-full font-mono">
          {unresolved.length} OPEN
        </span>
      </div>

      {unresolved.length === 0 && resolved.length === 0 ? (
        <EmptyState title="No reports" description="All clear — no scam reports have been submitted." />
      ) : (
        <div className="divide-y divide-line">
          {unresolved.length === 0 && (
            <div className="p-6 text-center text-xs text-primary font-medium">All reports resolved.</div>
          )}
          {unresolved.map(rep => (
            <div key={rep.id} className="p-5 space-y-3 hover:bg-panel-strong transition">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-sm text-fg line-clamp-1">{rep.property_name || 'Property'}</span>
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold shrink-0">Pending</span>
                </div>
                <span className="text-[11px] text-fg/40">
                  {new Date(rep.created_at).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-red-400 font-semibold">{rep.reason}</p>
              {rep.details && (
                <p className="text-xs text-fg/70 leading-relaxed bg-panel border border-line rounded-xl p-3 italic">
                  “{rep.details}”
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line">
                <div className="flex items-center gap-2 text-xs text-fg/50 min-w-0">
                  <PersonOffIcon size={13} className="text-fg/40 shrink-0" />
                  <span className="line-clamp-1">
                    Property Manager: <strong className="text-fg">{rep.landlord_name || 'Unknown'}</strong>
                  </span>
                  {rep.tenant_phone && (
                    <span className="hidden sm:inline text-fg/40">
                      · reported by <strong className="text-fg/50">{rep.tenant_phone}</strong>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {rep.landlord_id && (
                    <button
                      onClick={() => onRevokeManager(rep)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      <ShieldAlertIcon size={12} />
                      Revoke property manager's listings
                    </button>
                  )}
                  <button
                    onClick={() => onResolve(rep.id)}
                    className="flex items-center gap-1 bg-panel-strong hover:bg-panel-strong text-fg text-xs font-medium px-3 py-1.5 rounded-lg transition"
                  >
                    <CheckCircleIcon size={12} />
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
          {resolved.length > 0 && (
            <details className="p-4">
              <summary className="text-xs text-fg/40 cursor-pointer hover:text-fg/70 font-medium">
                Resolved ({resolved.length})
              </summary>
              <div className="mt-2 space-y-2">
                {resolved.map(rep => (
                  <div key={rep.id} className="flex items-center gap-2 text-xs text-fg/50">
                    <CheckCircleIcon size={12} className="text-primary shrink-0" />
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
