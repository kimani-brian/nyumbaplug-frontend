import React, { useState } from 'react';
import { ShieldCheckIcon, XCircleIcon, CheckCircleIcon, FileTextIcon, ExternalLinkIcon } from '../../utils/icons';
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
    <div className="bg-panel rounded-2xl border border-line shadow-soft overflow-hidden">
      <div className="p-5 bg-panel border-b border-line text-fg flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <ShieldCheckIcon size={18} className="text-primary" />
          Property Manager Verification Queue
        </h3>
        <span className="text-xs bg-panel-strong text-fg/70 px-2.5 py-1 rounded-full font-mono">
          {pendingList.length} PENDING
        </span>
      </div>

      {errorMsg && (
        <div className="m-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {pendingList.length === 0 ? (
        <div className="p-8 text-center text-fg/50 text-sm">
          No pending property manager verifications in queue.
        </div>
      ) : (
        <div className="divide-y divide-line overflow-x-auto">
          {pendingList.map(profile => (
            <div key={profile.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-panel-strong transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-fg text-sm">{profile.full_name || 'Property Manager Application'}</span>
                  {profile.is_caretaker && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold">
                      CARETAKER
                    </span>
                  )}
                </div>
                {profile.page_name && (
                  <p className="text-xs text-fg/50">
                    Page: <strong className="text-fg/80">{profile.page_name}</strong>
                  </p>
                )}
                <p className="text-xs text-fg/60 font-mono">
                  National ID: <strong>{profile.national_id_number}</strong>
                </p>
                {profile.is_caretaker && (
                  <p className="text-xs text-fg/50">
                    Authorized By: <span className="font-semibold text-fg">{profile.authorizer_name || profile.authorized_by_landlord_id}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {profile.id_document_url ? (
                  <a
                    href={profile.id_document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary bg-primary-light border border-primary/20 px-2.5 py-1.5 rounded-lg hover:bg-primary/20 transition"
                  >
                    <FileTextIcon size={14} />
                    <span>View ID Doc</span>
                    <ExternalLinkIcon size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-fg/40 italic">No document</span>
                )}

                <button
                  onClick={() => handleApprove(profile.id)}
                  disabled={approving === profile.id}
                  className="flex items-center gap-1 bg-primary hover:bg-primary-dark disabled:bg-panel-strong disabled:text-fg/40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  <CheckCircleIcon size={14} />
                  <span>{approving === profile.id ? '...' : 'Approve'}</span>
                </button>

                <button
                  onClick={() => onOpenRevoke(profile)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  <XCircleIcon size={14} />
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
