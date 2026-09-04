import React, { useEffect, useState } from 'react';
import { User, Phone, MapPin, Mail, Loader2, Pencil, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TenantProfile } from '../../types';
import { api } from '../../services/api';

export const CustomerAccount: React.FC = () => {
  const { user, customerProfile, setCustomerProfile, setUser } = useAuth();
  const [profile, setProfile] = useState<TenantProfile | null>(customerProfile);
  const [loading, setLoading] = useState(!customerProfile);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = async () => {
    try {
      const p = await api.getMyCustomerProfile();
      setProfile(p);
      if (setCustomerProfile) setCustomerProfile(p);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const startEdit = () => {
    setFullName(profile?.full_name || '');
    setPhone(user?.phone || '');
    setLocation(profile?.location || '');
    setError(null);
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) { setError('Full name is required'); return; }
    setSubmitting(true);
    try {
      const updated = await api.updateMyCustomerProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
      });
      setProfile(updated);
      if (setCustomerProfile) setCustomerProfile(updated);
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
          <div className="h-20 bg-panel-strong rounded-2xl" />
          <div className="h-64 bg-panel-strong rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-6">
      <div>
        <h1 className="display font-semibold text-3xl text-fg">Profile</h1>
        <p className="text-sm text-fg/60 mt-1">Keep your contact details up to date so property managers can reach you about rentals.</p>
      </div>

      <div className="bg-panel border border-line rounded-2xl shadow-soft overflow-hidden">
        <div className="p-5 sm:p-6 bg-panel border-b border-line flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-glow shrink-0">
            {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-tight">{profile?.full_name || 'Customer'}</h2>
            <p className="text-xs text-fg/60 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={12} className="text-primary" />
              Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-fg/70 mb-1.5">Full Name</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-line rounded-xl bg-panel focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
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
                <label className="block text-xs font-semibold text-fg/70 mb-1.5">Phone Number</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-line rounded-xl bg-panel focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
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
                <label className="block text-xs font-semibold text-fg/70 mb-1.5">Preferred Location</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-line rounded-xl bg-panel focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
                  <MapPin size={16} className="text-fg/40 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Nairobi, Westlands"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{error}</p>}

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
                  <span className="text-[10px] uppercase font-semibold text-fg/40 block mb-1">Full Name</span>
                  <span className="text-fg font-medium">{profile?.full_name || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-fg/40 block mb-1">Email</span>
                  <span className="text-fg flex items-center gap-1.5">
                    <Mail size={14} className="text-fg/40" />
                    {user?.email || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-fg/40 block mb-1">Phone</span>
                  <span className="text-fg flex items-center gap-1.5">
                    <Phone size={14} className="text-fg/40" />
                    {user?.phone || profile?.full_name ? user?.phone || '—' : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-fg/40 block mb-1">Preferred Location</span>
                  <span className="text-fg flex items-center gap-1.5">
                    <MapPin size={14} className="text-fg/40" />
                    {profile?.location || '—'}
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
