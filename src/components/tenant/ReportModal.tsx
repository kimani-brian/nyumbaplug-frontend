import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

export const ReportModal: React.FC<Props> = ({ isOpen, onClose, propertyId, propertyName }) => {
  const [reason, setReason] = useState('Asked for deposit before viewing');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please write a short message describing the scam.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.createReport(propertyId, reason, details.trim());
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl border border-slate-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle size={22} />
          <h3 className="text-lg font-bold">Report Property or Scam</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Property: <span className="font-semibold text-slate-800">{propertyName}</span></p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-medium text-center">
            Report submitted to NyumbaPlug Trust & Safety Team for audit.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-500"
              >
                <option value="Asked for deposit before viewing">Asked for M-Pesa deposit before viewing</option>
                <option value="Landlord unreachable">Property manager unreachable</option>
                <option value="Property does not exist">Property does not exist / Fake listing</option>
                <option value="Price mismatch">Price mismatch / Extortionate fees</option>
                <option value="Other">Other fraud concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Scam Message</label>
              <textarea
                rows={4}
                required
                placeholder="Describe exactly what happened — e.g. the property manager asked me to send KSh 5,000 via M-Pesa before showing the house..."
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
              />
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              {submitting ? 'Submitting...' : 'Submit Scam Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
