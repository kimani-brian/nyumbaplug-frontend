import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Phone, MapPin, CalendarDays } from 'lucide-react';
import { CustomerProfile } from '../../types';
import { api } from '../../services/api';

export const CustomerProfilePage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      api.getCustomerProfile(customerId)
        .then(setProfile)
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    }
  }, [customerId]);

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

  if (!profile) {
    return (
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <p className="text-sm text-slate-500">Customer not found.</p>
        <Link to="/admin" className="text-xs text-nyumba-emerald font-semibold">Back to Admin Console</Link>
      </main>
    );
  }

  const detail = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-nyumba-cream border border-nyumba-line flex items-center justify-center text-slate-500 shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">{label}</span>
        <span className="text-sm text-slate-900 font-medium">{value || '—'}</span>
      </div>
    </div>
  );

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-nyumba-emerald transition"
      >
        <ArrowLeft size={16} />
        Back to Admin Console
      </Link>

      <div className="bg-white rounded-2xl border border-nyumba-line shadow-soft overflow-hidden">
        <div className="p-5 sm:p-6 bg-nyumba-navy text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-nyumba-emerald text-white flex items-center justify-center text-xl font-bold shadow-soft shrink-0">
            {(profile.full_name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1 flex items-center gap-1.5">
              <Users size={12} /> Customer Profile
            </p>
            <h1 className="font-semibold text-xl leading-tight">{profile.full_name || 'Unnamed Customer'}</h1>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {detail(<Mail size={16} />, 'Email', profile.email)}
            {detail(<Phone size={16} />, 'Phone', profile.phone)}
            {detail(<MapPin size={16} />, 'Preferred Location', profile.location || profile.profile.location)}
            {detail(
              <CalendarDays size={16} />,
              'Registered',
              new Date(profile.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
            )}
          </div>

          {profile.profile.full_name && (
            <div className="bg-nyumba-cream border border-nyumba-line rounded-xl p-3.5 text-xs text-slate-600">
              Profile name on file: <strong className="text-slate-800">{profile.profile.full_name}</strong>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
