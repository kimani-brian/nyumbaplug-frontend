import React, { useState } from 'react';
import { User, Phone, Link, Building2, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { LandlordProfile } from '../../types';

interface Props {
  onSuccess: (profile: LandlordProfile) => void;
  profile?: LandlordProfile | null;
  initialPhone?: string;
}

export const ProfileForm: React.FC<Props> = ({ onSuccess, profile, initialPhone }) => {
  const isEdit = !!profile;
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [pageName, setPageName] = useState(profile?.page_name || '');
  const [phone, setPhone] = useState(isEdit ? (initialPhone || '') : '');
  const [idDocURL, setIdDocURL] = useState(profile?.id_document_url || '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isEdit) {
      setSubmitting(true);
      try {
        const updated = await api.updateMyProfile({
          full_name: fullName.trim() || undefined,
          page_name: pageName.trim() || undefined,
          phone: phone.trim() || undefined,
          id_document_url: idDocURL.trim() || undefined,
        });
        onSuccess(updated);
      } catch (err: any) {
        setError(err.message || 'Failed to update profile');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!fullName.trim()) { setError('Full name is required'); return; }

    setSubmitting(true);
    try {
      const profile = await api.submitVerificationRequest({
        full_name: fullName.trim(),
        page_name: pageName.trim() || undefined,
        phone: phone.trim() || undefined,
        national_id_number: '',
        id_document_url: idDocURL.trim() || undefined,
      });
      onSuccess(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-panel rounded-3xl border border-line shadow-soft max-w-lg mx-auto p-8">
      <div className="text-center mb-6">
        <div className="bg-primary p-2 rounded-2xl inline-flex text-white mb-3 shadow-glow">
          <User size={28} />
        </div>
        <h2 className="text-xl font-bold text-fg">{isEdit ? 'Edit Profile' : 'Complete Your Property Manager Profile'}</h2>
        <p className="text-xs text-fg/50 mt-1">
          {isEdit ? 'Update your profile information.' : 'Fill in your details and submit for admin verification before you can list properties.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-fg/70 mb-1">Full Name</label>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-line rounded-lg bg-panel focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <User size={16} className="text-fg/40 shrink-0" />
            <input
              type="text"
              placeholder="e.g. Jane Wambui"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-fg/70 mb-1">Page Name</label>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-line rounded-lg bg-panel focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <Building2 size={16} className="text-fg/40 shrink-0" />
            <input
              type="text"
              placeholder="e.g. Greenleaf Properties"
              value={pageName}
              onChange={e => setPageName(e.target.value)}
              className="w-full bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-fg/40 mt-1">Public name shown on your listings page.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-fg/70 mb-1">Phone Number</label>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-line rounded-lg bg-panel focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <Phone size={16} className="text-fg/40 shrink-0" />
            <input
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-fg/70 mb-1">ID Document URL</label>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-line rounded-lg bg-panel focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <Link size={16} className="text-fg/40 shrink-0" />
            <input
              type="url"
              placeholder="https://example.com/my-id.jpg"
              value={idDocURL}
              onChange={e => setIdDocURL(e.target.value)}
              className="w-full bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary !py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {isEdit ? 'Saving...' : 'Submitting...'}
            </>
          ) : (
            isEdit ? 'Save Changes' : 'Submit for Verification'
          )}
        </button>
      </form>
    </div>
  );
};
