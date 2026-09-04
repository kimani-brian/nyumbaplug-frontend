import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CloseIcon, MailIcon, LoaderIcon, SendIcon } from '../../utils/icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unitId?: string;
  propertyName: string;
}

export const MessageModal: React.FC<Props> = ({ isOpen, onClose, unitId, propertyName }) => {
  const [phone, setPhone] = useState('');
  const [loadingContact, setLoadingContact] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [message, setMessage] = useState("Hi, I'd like to know more about this unit. Please get in touch with me.");
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
    if (!name.trim() || !tenantPhone.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.sendMessage(unitId!, {
        tenant_name: name.trim(),
        tenant_phone: tenantPhone.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Could not send your message. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-panel rounded-2xl max-w-md w-full p-6 sm:p-7 relative shadow-lift border border-line animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-panel-strong transition" aria-label="Close">
          <CloseIcon size={20} />
        </button>

        {/* Property header - centered */}
        <div className="text-center mb-6">
          <div className="bg-green-600 text-white p-3 rounded-full inline-flex mb-4">
            <MailIcon size={22} />
          </div>
          <h3 className="display font-bold text-lg text-fg leading-tight mb-2">{propertyName}</h3>
          {loadingContact ? (
            <p className="text-xs text-fg/40 inline-flex items-center justify-center gap-1.5">
              <LoaderIcon size={12} className="animate-spin" /> Loading contact…
            </p>
          ) : contactError ? (
            <p className="text-xs text-red-400">{contactError}</p>
          ) : (
            <a href={`tel:${phone}`} className="text-sm text-primary font-semibold inline-flex items-center justify-center gap-1.5 hover:underline">
              {phone}
            </a>
          )}
        </div>

        {/* Write us a message */}
        {submitted ? (
          <div className="text-center py-6">
            <svg className="mx-auto text-green-500 mb-3" width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
            <h4 className="font-bold text-fg">Message sent!</h4>
            <p className="text-sm text-fg/60 mt-1">The property manager has been notified and will get back to you shortly.</p>
            <button onClick={onClose} className="btn-outline w-full mt-5 !py-2.5">Done</button>
          </div>
        ) : (
          <>
            <h4 className="font-bold text-fg mb-4 text-center">Write us a message</h4>
            <p className="text-xs text-fg/50 mt-0.5 mb-4 text-center">The manager will receive this message.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-fg/70 mb-1">Your name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
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
                  className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-fg/70 mb-1">Your message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type your message here…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-y min-h-[100px]"
                />
                <p className="text-xs text-fg/40 mt-1 text-right">{message.length}/1000</p>
              </div>

              {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary !py-3 !rounded-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2"><LoaderIcon size={15} className="animate-spin" /> Sending…</span>
                  ) : (
                    <span className="inline-flex items-center gap-2"><SendIcon size={16} /> Submit message</span>
                  )}
                </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};