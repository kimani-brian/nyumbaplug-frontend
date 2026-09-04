import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlertTriangleIcon, CloseIcon, CheckCircleIcon, LoaderIcon } from '../../utils/icons';

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

  const inputCls = 'w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg placeholder:text-fg/40 hover:border-fg/25 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-panel rounded-2xl max-w-md w-full p-6 sm:p-7 relative shadow-lift border border-line animate-scale-in" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close report dialog"
          className="absolute top-4 right-4 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-panel-strong transition"
        >
          <CloseIcon size={20} />
        </button>

        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangleIcon size={22} />
          <h3 className="text-lg font-bold text-fg">Report Property or Scam</h3>
        </div>
        <p className="text-xs text-fg/50 mb-4">Property: <span className="font-semibold text-fg">{propertyName}</span></p>

        {submitted ? (
          <div
            role="status"
            className="p-4 bg-primary-light border border-primary/20 rounded-lg text-primary-dark text-sm font-medium text-center inline-flex items-center justify-center gap-2 w-full"
          >
            <CheckCircleIcon size={16} />
            Report submitted to NyumbaPlug Trust & Safety Team for audit.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="report-reason" className="block text-xs font-medium text-fg/70 mb-1.5">Reason for Report</label>
              <select
                id="report-reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className={inputCls}
              >
                <option value="Asked for deposit before viewing">Asked for M-Pesa deposit before viewing</option>
                <option value="Landlord unreachable">Property manager unreachable</option>
                <option value="Property does not exist">Property does not exist / Fake listing</option>
                <option value="Price mismatch">Price mismatch / Extortionate fees</option>
                <option value="Other">Other fraud concern</option>
              </select>
            </div>

            <div>
              <label htmlFor="report-details" className="block text-xs font-medium text-fg/70 mb-1.5">Your Scam Message</label>
              <textarea
                id="report-details"
                rows={4}
                required
                placeholder="Describe exactly what happened — e.g. the property manager asked me to send KSh 5,000 via M-Pesa before showing the house..."
                value={details}
                onChange={e => setDetails(e.target.value)}
                className={inputCls}
              />
              {error && (
                <p role="alert" className="text-xs text-red-600 mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              {submitting && <LoaderIcon size={14} className="animate-spin" />}
              {submitting ? 'Submitting…' : 'Submit Scam Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
