import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { LandlordProfile } from '../../types';
import { api } from '../../services/api';

interface Props {
  pendingList: LandlordProfile[];
  onRefresh: () => void;
  onOpenRevoke: (profile: LandlordProfile) => void;
}

export const VerificationQueue: React.FC<Props> = ({ pendingList, onRefresh, onOpenRevoke }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  const handleApprove = async (landlordId: string) => {
    setErrorMsg(null);
    setApproving(landlordId);
    try {
      await api.approveLandlord(landlordId);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Approval failed');
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <ShieldCheck size={18} className="text-nyumba-emerald" />
          Agent Verification Queue
        </h3>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
          {pendingList.length} PENDING
        </span>
      </div>

      {errorMsg && (
        <div className="m-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded">
          {errorMsg}
        </div>
      )}

      {pendingList.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          No pending agent verifications in queue.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 overflow-x-auto">
          {pendingList.map(profile => (
            <div key={profile.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{profile.full_name || 'Agent Application'}</span>
                  {profile.is_caretaker && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                      CARETAKER
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  National ID: <strong>{profile.national_id_number}</strong>
                </p>
                {profile.is_caretaker && (
                  <p className="text-xs text-slate-500">
                    Authorized By: <span className="font-semibold text-slate-800">{profile.authorizer_name || profile.authorized_by_landlord_id}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {profile.id_document_url ? (
                  <a
                    href={profile.id_document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded hover:bg-blue-100"
                  >
                    <FileText size={14} />
                    <span>View ID Doc</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">No document</span>
                )}

                <button
                  onClick={() => handleApprove(profile.id)}
                  disabled={approving === profile.id}
                  className="flex items-center gap-1 bg-nyumba-emerald hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
                >
                  <CheckCircle size={14} />
                  <span>{approving === profile.id ? '...' : 'Approve'}</span>
                </button>

                <button
                  onClick={() => onOpenRevoke(profile)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
                >
                  <XCircle size={14} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
