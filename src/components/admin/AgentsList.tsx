import React from 'react';
import { Building2, ShieldCheck, Clock, AlertOctagon, Eye, XCircle, User, CheckCircle } from 'lucide-react';
import { AgentView } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  agents: AgentView[];
  onViewProperties: (agentId: string) => void;
  onViewProfile?: (agentId: string) => void;
  onOpenRevoke?: (agent: AgentView) => void;
  onVerifyAgent?: (agentId: string) => void;
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'verified': return <ShieldCheck size={14} className="text-nyumba-emerald" />;
    case 'pending': return <Clock size={14} className="text-amber-600" />;
    case 'revoked': return <AlertOctagon size={14} className="text-red-600" />;
    default: return null;
  }
};

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    verified: 'bg-nyumba-emeraldLight text-nyumba-emerald border-emerald-300',
    pending: 'bg-amber-50 text-amber-800 border-amber-300',
    revoked: 'bg-red-50 text-red-800 border-red-300',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${styles[status] || ''}`}>
      {statusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const AgentsList: React.FC<Props> = ({ agents, onViewProperties, onViewProfile, onOpenRevoke, onVerifyAgent }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Building2 size={18} className="text-nyumba-emerald" />
          All Agents
        </h3>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
          {agents.length} TOTAL
        </span>
      </div>

      {agents.length === 0 ? (
        <EmptyState title="No agents registered" description="Agents will appear here once they register." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left p-3 font-semibold text-slate-600">Name</th>
                <th className="text-left p-3 font-semibold text-slate-600">National ID</th>
                <th className="text-left p-3 font-semibold text-slate-600">Email</th>
                <th className="text-left p-3 font-semibold text-slate-600">Phone</th>
                <th className="text-left p-3 font-semibold text-slate-600">Status</th>
                <th className="text-left p-3 font-semibold text-slate-600">Registered</th>
                {agents.some(a => a.revoke_reason) && <th className="text-left p-3 font-semibold text-slate-600">Reason</th>}
                <th className="text-left p-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agents.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-900 font-medium">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-slate-400 shrink-0" />
                      {a.full_name || '—'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-900 font-mono">{a.national_id_number}</td>
                  <td className="p-3 text-slate-600">{a.email || '—'}</td>
                  <td className="p-3 text-slate-600">{a.phone || '—'}</td>
                  <td className="p-3">{statusBadge(a.verification_status)}</td>
                  <td className="p-3 text-slate-500">{new Date(a.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  {a.revoke_reason && <td className="p-3 text-red-600 italic max-w-[200px] truncate" title={a.revoke_reason}>{a.revoke_reason}</td>}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {onViewProfile && (
                        <button
                          onClick={() => onViewProfile(a.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                          title="View Profile"
                        >
                          <User size={14} />
                          Profile
                        </button>
                      )}
                      <button
                          onClick={() => onViewProperties(a.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-nyumba-emerald hover:text-emerald-700 transition"
                        >
                          <Eye size={14} />
                          Properties
                        </button>
                        {onVerifyAgent && a.verification_status === 'revoked' && (
                          <button
                            onClick={() => onVerifyAgent(a.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition"
                          >
                            <CheckCircle size={14} />
                            Verify
                          </button>
                        )}
                        {onOpenRevoke && a.verification_status !== 'revoked' && (
                        <button
                          onClick={() => onOpenRevoke(a)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition"
                        >
                          <XCircle size={14} />
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
