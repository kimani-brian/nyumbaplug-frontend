import React, { useState, useEffect } from 'react';
import { Phone, X, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  unitId?: string;
  propertyName: string;
}

export const CallBackModal: React.FC<Props> = ({ isOpen, onClose, propertyId, unitId, propertyName }) => {
  const [phone, setPhone] = useState('');
  const [loadingContact, setLoadingContact] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingContact(true);
    setContactError(null);
    setSubmitted(false);
    setError(null);
    api.getUnitContact(unitId!)
      .then(res => setPhone(res.landlord_phone))
      .catch(err => setContactError(err.message))
      .finally(() => setLoadingContact(false));
  }, [isOpen, unitId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !tenantPhone.trim()) {
      setError('Enter your name and phone number');
      return;
    }
    setSubmitting(true);
    try {
      await api.requestCallBack(propertyId, {
        unit_category_id: unitId,
        tenant_name: name.trim(),
        tenant_phone: tenantPhone.trim(),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Could not send your request. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-panel rounded-3xl max-w-md w-full p-6 sm:p-7 relative shadow-lift border border-line animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-slate-100 transition">
          <X size={20} />
        </button>

        {/* Property + manager phone - centered */}
        <div className="text-center mb-6">
          <div className="bg-primary text-white p-3 rounded-full inline-flex mb-4">
            <Phone size={22} />
          </div>
          <h3 className="display font-bold text-lg text-fg leading-tight mb-2">{propertyName}</h3>
          {loadingContact ? (
            <p className="text-xs text-fg/40 inline-flex items-center justify-center gap-1.5">
              <Loader2 size={12} className="animate-spin" /> Loading manager contact…
            </p>
          ) : contactError ? (
            <p className="text-xs text-red-400">{contactError}</p>
          ) : (
            <a href={`tel:${phone}`} className="text-sm text-primary font-semibold inline-flex items-center justify-center gap-1.5 hover:underline">
              <Phone size={14} />
              {phone}
            </a>
          )}
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={44} className="mx-auto text-primary mb-3" />
            <h4 className="font-bold text-fg">Request sent!</h4>
            <p className="text-sm text-fg/60 mt-1">The manager has been notified and will call you back shortly.</p>
            <button onClick={onClose} className="btn-outline w-full mt-5 !py-2.5">Done</button>
          </div>
        ) : (
          <>
            <div className="border-t border-line pt-5">
              <h4 className="font-bold text-fg">Want us to call you back?</h4>
              <p className="text-xs text-fg/50 mt-0.5 mb-4">
                Leave your details and the property manager will ring you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-fg/70 mb-1">Your name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Wanjiku"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-sm border border-line rounded-xl p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-fg/70 mb-1">Your phone number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    value={tenantPhone}
                    onChange={e => setTenantPhone(e.target.value)}
                    className="w-full text-sm border border-line rounded-xl p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting || loadingContact}
                  className="w-full btn-primary !py-3 !rounded-xl disabled:opacity-50"
                >
                  <Phone size={16} />
                  {submitting ? 'Sending request…' : 'Request a call'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
