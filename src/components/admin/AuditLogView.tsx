import React from 'react';
import { History, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AdminAuditLog } from '../../types';

interface Props {
  logs: AdminAuditLog[];
}

export const AuditLogView: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl border border-nyumba-line shadow-soft overflow-hidden">
      <div className="p-5 bg-nyumba-navy text-white flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <History size={18} className="text-nyumba-emerald" />
          Audit Trail
        </h3>
      </div>

      <div className="divide-y divide-nyumba-line max-h-96 overflow-y-auto custom-scrollbar">
        {logs.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400">No audit log entries yet.</div>
        )}
        {logs.map(log => {
          const formattedDate = new Date(log.created_at).toLocaleString('en-KE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={log.id} className="p-4 text-xs flex items-start gap-3 hover:bg-nyumba-cream/60">
              {log.action === 'verify_landlord' && (
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                  <Shield size={16} />
                </div>
              )}
              {log.action === 'revoke_landlord' && (
                <div className="p-1.5 bg-red-100 text-red-800 rounded-lg shrink-0">
                  <AlertTriangle size={16} />
                </div>
              )}
              {log.action === 'resolve_report' && (
                <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg shrink-0">
                  <CheckCircle2 size={16} />
                </div>
              )}

              <div className="flex-1 space-y-0.5">
                <p className="text-slate-800 font-medium leading-relaxed">
                  <span className="font-bold text-slate-900">{log.admin_phone || 'Admin'}</span>
                  {log.action === 'verify_landlord' && ` verified property manager `}
                  {log.action === 'revoke_landlord' && ` revoked property manager `}
                  {log.action === 'resolve_report' && ` resolved report `}
                  <strong className="text-slate-900">{log.target_name}</strong>
                </p>
                {log.reason && (
                  <p className="text-slate-500 italic bg-nyumba-cream border border-nyumba-line p-2 rounded-lg mt-1">
                    &ldquo;{log.reason}&rdquo;
                  </p>
                )}
              </div>

              <span className="text-[10px] text-slate-400 shrink-0 font-mono">{formattedDate}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
