import React from 'react';
import { Building2Icon, ShieldCheckIcon, ClockIcon, AlertOctagonIcon, EyeIcon, XCircleIcon, UserIcon, CheckCircleIcon } from '../../utils/icons';
import { PropertyManagerView } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  managers: PropertyManagerView[];
  onViewProperties: (managerId: string) => void;
  onViewProfile?: (managerId: string) => void;
  onOpenRevoke?: (manager: PropertyManagerView) => void;
  onVerifyManager?: (managerId: string) => void;
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'verified': return <ShieldCheckIcon size={14} className="text-primary" />;
    case 'pending': return <ClockIcon size={14} className="text-amber-600" />;
    case 'revoked': return <AlertOctagonIcon size={14} className="text-red-600" />;
    default: return null;
  }
};

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    verified: 'bg-primary text-white border-primary/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    revoked: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${styles[status] || ''}`}>
      {statusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const PropertyManagersList: React.FC<Props> = ({ managers, onViewProperties, onViewProfile, onOpenRevoke, onVerifyManager }) => {
  return (
    <div className="bg-panel rounded-2xl border border-line shadow-soft overflow-hidden">
      <div className="p-5 bg-panel border-b border-line text-fg flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Building2Icon size={18} className="text-primary" />
          All Property Managers
        </h3>
        <span className="text-xs bg-panel-strong text-fg/70 px-2.5 py-1 rounded-full font-mono">
          {managers.length} TOTAL
        </span>
      </div>

      {managers.length === 0 ? (
        <EmptyState title="No property managers registered" description="Property managers will appear here once they register." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-line bg-panel">
                <th className="text-left p-3 font-semibold text-fg/60">Name</th>
                <th className="text-left p-3 font-semibold text-fg/60">Page Name</th>
                <th className="text-left p-3 font-semibold text-fg/60">National ID</th>
                <th className="text-left p-3 font-semibold text-fg/60">Email</th>
                <th className="text-left p-3 font-semibold text-fg/60">Phone</th>
                <th className="text-left p-3 font-semibold text-fg/60">Status</th>
                <th className="text-left p-3 font-semibold text-fg/60">Registered</th>
                {managers.some(a => a.revoke_reason) && <th className="text-left p-3 font-semibold text-fg/60">Reason</th>}
                <th className="text-left p-3 font-semibold text-fg/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {managers.map(a => (
                <tr key={a.id} className="hover:bg-panel-strong transition">
                  <td className="p-3 text-fg font-medium">
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={14} className="text-fg/40 shrink-0" />
                      {a.full_name || '—'}
                    </span>
                  </td>
                  <td className="p-3 text-fg/80">{a.page_name || '—'}</td>
                  <td className="p-3 text-fg font-mono">{a.national_id_number}</td>
                  <td className="p-3 text-fg/60">{a.email || '—'}</td>
                  <td className="p-3 text-fg/60">{a.phone || '—'}</td>
                  <td className="p-3">{statusBadge(a.verification_status)}</td>
                  <td className="p-3 text-fg/50">{new Date(a.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  {a.revoke_reason && <td className="p-3 text-red-600 italic max-w-[200px] truncate" title={a.revoke_reason}>{a.revoke_reason}</td>}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {onViewProfile && (
                        <button
                          onClick={() => onViewProfile(a.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-fg/60 hover:text-fg transition"
                          title="View Profile"
                        >
                          <UserIcon size={14} />
                          Profile
                        </button>
                      )}
                      <button
                          onClick={() => onViewProperties(a.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary transition"
                        >
                          <EyeIcon size={14} />
                          Properties
                        </button>
                        {onVerifyManager && a.verification_status === 'revoked' && (
                          <button
                            onClick={() => onVerifyManager(a.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary transition"
                          >
                            <CheckCircleIcon size={14} />
                            Verify
                          </button>
                        )}
                        {onOpenRevoke && a.verification_status !== 'revoked' && (
                        <button
                          onClick={() => onOpenRevoke(a)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-400 transition"
                        >
                          <XCircleIcon size={14} />
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
