import React from 'react';
import { Flag, CheckCircle } from 'lucide-react';
import { PropertyReport } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  reports: PropertyReport[];
  onResolve: (reportId: string) => void;
}

export const ReportsQueue: React.FC<Props> = ({ reports, onResolve }) => {
  const unresolved = reports.filter(r => !r.resolved);
  const resolved = reports.filter(r => r.resolved);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Flag size={18} className="text-red-500" />
          Scam Reports Queue
        </h3>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
          {unresolved.length} OPEN
        </span>
      </div>

      {unresolved.length === 0 && resolved.length === 0 ? (
        <EmptyState title="No reports" description="All clear — no scam reports have been submitted." />
      ) : (
        <div className="divide-y divide-slate-100">
          {unresolved.length === 0 && (
            <div className="p-6 text-center text-xs text-emerald-600 font-medium">All reports resolved.</div>
          )}
          {unresolved.map(rep => (
            <div key={rep.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{rep.property_name || 'Property'}</span>
                  <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-semibold">Pending</span>
                </div>
                <p className="text-xs text-red-700 font-semibold">{rep.reason}</p>
                {rep.details && <p className="text-xs text-slate-500 line-clamp-2">{rep.details}</p>}
              </div>
              <button
                onClick={() => onResolve(rep.id)}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded transition"
              >
                <CheckCircle size={12} />
                Resolve
              </button>
            </div>
          ))}
          {resolved.length > 0 && (
            <details className="p-3">
              <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 font-medium">
                Resolved ({resolved.length})
              </summary>
              <div className="mt-2 space-y-2">
                {resolved.map(rep => (
                  <div key={rep.id} className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    <span className="line-clamp-1">{rep.property_name || 'Property'} — {rep.reason}</span>
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
