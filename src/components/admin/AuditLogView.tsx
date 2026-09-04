import React from 'react';
import { HistoryIcon, ShieldIcon, AlertTriangleIcon, CheckCircleIcon } from '../../utils/icons';
import { AdminAuditLog } from '../../types';

interface Props {
  logs: AdminAuditLog[];
}

export const AuditLogView: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-panel rounded-2xl border border-line shadow-soft overflow-hidden">
      <div className="p-5 bg-panel border-b border-line text-fg flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <HistoryIcon size={18} className="text-primary" />
          Audit Trail
        </h3>
      </div>

      <div className="divide-y divide-line max-h-96 overflow-y-auto custom-scrollbar">
        {logs.length === 0 && (
          <div className="p-6 text-center text-xs text-fg/40">No audit log entries yet.</div>
        )}
        {logs.map(log => {
          const formattedDate = new Date(log.created_at).toLocaleString('en-KE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={log.id} className="p-4 text-xs flex items-start gap-3 hover:bg-panel-strong">
              {log.action === 'verify_landlord' && (
                <div className="p-1.5 bg-primary text-white rounded-lg shrink-0">
                  <ShieldIcon size={16} />
                </div>
              )}
              {log.action === 'revoke_landlord' && (
                <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg shrink-0">
                  <AlertTriangleIcon size={16} />
                </div>
              )}
              {log.action === 'resolve_report' && (
                <div className="p-1.5 bg-primary-light text-primary rounded-lg shrink-0">
                  <CheckCircleIcon size={16} />
                </div>
              )}

              <div className="flex-1 space-y-0.5">
                <p className="text-fg/70 font-medium leading-relaxed">
                  <span className="font-bold text-fg">{log.admin_phone || 'Admin'}</span>
                  {log.action === 'verify_landlord' && ` verified property manager `}
                  {log.action === 'revoke_landlord' && ` revoked property manager `}
                  {log.action === 'resolve_report' && ` resolved report `}
                  <strong className="text-fg">{log.target_name}</strong>
                </p>
                {log.reason && (
                  <p className="text-fg/50 italic bg-panel border border-line p-2 rounded-lg mt-1">
                    &ldquo;{log.reason}&rdquo;
                  </p>
                )}
              </div>

              <span className="text-[10px] text-fg/40 shrink-0 font-mono">{formattedDate}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
