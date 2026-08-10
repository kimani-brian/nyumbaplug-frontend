import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { LandlordProfile, PropertyManagerView } from '../../types';
import { api } from '../../services/api';

export type RevokeTarget = LandlordProfile | PropertyManagerView | { id: string; full_name?: string; national_id_number?: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  landlord: RevokeTarget | null;
  onSuccess: () => void;
}

export const RevokeModal: React.FC<Props> = ({ isOpen, onClose, landlord, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !landlord) return null;

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await api.revokeLandlord(landlord.id, reason);
      onSuccess();
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-panel rounded-3xl max-w-md w-full p-6 sm:p-7 relative shadow-lift border border-red-500/20 animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-panel-strong transition">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-red-600 mb-3">
          <AlertTriangle size={24} />
          <h3 className="text-lg font-bold text-fg">Revoke Property Manager Profile</h3>
        </div>

        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 mb-4 space-y-1">
          <strong className="block uppercase font-bold text-red-400">Blast Radius Impact</strong>
          <p>
            Revoking <strong>{landlord.full_name || landlord.national_id_number}</strong> will immediately hide their properties and units from tenant search.
          </p>
        </div>

        <form onSubmit={handleRevoke} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">
              Revocation Reason * (Logged to Audit Log)
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Fraudulent national ID document, reported for deposit scam..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full text-sm border border-line rounded-xl p-2.5 bg-panel text-fg focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-panel-strong disabled:text-fg/40 text-white font-bold py-2.5 rounded-xl text-sm transition"
          >
            {submitting ? 'Revoking...' : 'Confirm & Revoke Immediately'}
          </button>
        </form>
      </div>
    </div>
  );
};
