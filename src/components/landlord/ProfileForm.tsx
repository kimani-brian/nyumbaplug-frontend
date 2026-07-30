import React, { useState } from 'react';
import { User, Phone, Link, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { LandlordProfile } from '../../types';

interface Props {
  onSuccess: (profile: LandlordProfile) => void;
  profile?: LandlordProfile | null;
}

export const ProfileForm: React.FC<Props> = ({ onSuccess, profile }) => {
  const isEdit = !!profile;
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState('');
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto p-8">
      <div className="text-center mb-6">
        <div className="bg-nyumba-emerald p-2 rounded-xl inline-flex text-white mb-3">
          <User size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-900">{isEdit ? 'Edit Profile' : 'Complete Your Agent Profile'}</h2>
        <p className="text-xs text-slate-500 mt-1">
          {isEdit ? 'Update your profile information.' : 'Fill in your details and submit for admin verification before you can list properties.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
            <User size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="e.g. Jane Wambui"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
            <Phone size={16} className="text-slate-400 shrink-0" />
            <input
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">ID Document URL</label>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
            <Link size={16} className="text-slate-400 shrink-0" />
            <input
              type="url"
              placeholder="https://example.com/my-id.jpg"
              value={idDocURL}
              onChange={e => setIdDocURL(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-nyumba-emerald hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
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
