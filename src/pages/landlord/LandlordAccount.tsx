import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, Building2, Loader2, Pencil, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LandlordProfile } from '../../types';
import { api } from '../../services/api';

export const LandlordAccount: React.FC = () => {
  const { user, landlordProfile, setLandlordProfile, setUser } = useAuth();
  const [profile, setProfile] = useState<LandlordProfile | null>(landlordProfile);
  const [loading, setLoading] = useState(!landlordProfile);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [pageName, setPageName] = useState('');
  const [phone, setPhone] = useState('');
  const [idDocURL, setIdDocURL] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = async () => {
    try {
      const p = await api.getMyLandlordProfile();
      setProfile(p);
      if (setLandlordProfile) setLandlordProfile(p);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const startEdit = () => {
    setFullName(profile?.full_name || '');
    setPageName(profile?.page_name || '');
    setPhone(user?.phone || '');
    setIdDocURL(profile?.id_document_url || '');
    setError(null);
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) { setError('Full name is required'); return; }
    setSubmitting(true);
    try {
      const updated = await api.updateMyProfile({
        full_name: fullName.trim(),
        page_name: pageName.trim() || undefined,
        phone: phone.trim() || undefined,
        id_document_url: idDocURL.trim() || undefined,
      });
      setProfile(updated);
      if (setLandlordProfile) setLandlordProfile(updated);
      if (user && setUser && phone.trim()) {
        setUser({ ...user, phone: phone.trim() });
      }
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-nyumba-sand rounded-2xl" />
          <div className="h-64 bg-nyumba-sand rounded-2xl" />
        </div>
      </main>
    );
  }

  const isVerified = profile?.verification_status === 'verified';

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-nyumba-terracotta mb-1">My Account</p>
        <h1 className="display font-semibold text-3xl text-nyumba-ink">Property manager profile</h1>
        <p className="text-sm text-slate-500 mt-1">Keep your business details up to date so tenants can find and reach you.</p>
      </div>

      <div className="bg-white rounded-2xl border border-nyumba-line shadow-soft overflow-hidden">
        <div className="p-5 sm:p-6 bg-nyumba-navy text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-nyumba-emerald text-white flex items-center justify-center text-xl font-bold shadow-soft shrink-0">
            {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-tight">{profile?.full_name || profile?.page_name || 'Property Manager'}</h2>
            {profile?.page_name && profile.page_name !== profile.full_name && (
              <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
                <Building2 size={12} className="text-nyumba-emerald" />
                {profile.page_name}
              </p>
            )}
            <p className="text-xs text-white/60 flex items-center gap-1.5 mt-0.5">
              {isVerified ? (
                <>
                  <ShieldCheck size={12} className="text-nyumba-emerald" />
                  Verified property manager
                </>
              ) : (
                <>
                  <Clock size={12} className="text-amber-400" />
                  Awaiting verification
                </>
              )}
            </p>
            <p className="text-xs text-white/60 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={12} className="text-nyumba-emerald" />
              Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-nyumba-cream focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Page Name</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-nyumba-cream focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                  <Building2 size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Greenleaf Properties"
                    value={pageName}
                    onChange={e => setPageName(e.target.value)}
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Public name shown on your listings page.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-nyumba-cream focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">ID Document URL</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-nyumba-cream focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="url"
                    placeholder="https://example.com/my-id.jpg"
                    value={idDocURL}
                    onChange={e => setIdDocURL(e.target.value)}
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg">{error}</p>}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !py-2.5 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-outline !py-2.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Full Name</span>
                  <span className="text-slate-900 font-medium">{profile?.full_name || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Page Name</span>
                  <span className="text-slate-900 flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-400" />
                    {profile?.page_name || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Email</span>
                  <span className="text-slate-900 flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    {user?.email || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Phone</span>
                  <span className="text-slate-900 flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-400" />
                    {user?.phone || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">National ID</span>
                  <span className="text-slate-900 font-mono">{profile?.national_id_number || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Verification</span>
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                    isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isVerified ? <ShieldCheck size={14} /> : <Clock size={14} />}
                    {isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              <button onClick={startEdit} className="btn-outline !py-2.5">
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
