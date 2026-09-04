import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowBack, UsersIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon } from '../../utils/icons';
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
          <div className="h-20 bg-panel-strong rounded-2xl" />
          <div className="h-64 bg-panel-strong rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <p className="text-sm text-fg/60">Customer not found.</p>
        <Link to="/admin" className="text-xs text-primary font-semibold">Back to Admin Console</Link>
      </main>
    );
  }

  const detail = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-panel-strong border border-line flex items-center justify-center text-fg/50 shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-[10px] uppercase font-semibold text-fg/40 block mb-0.5">{label}</span>
        <span className="text-sm text-fg font-medium">{value || '—'}</span>
      </div>
    </div>
  );

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg/60 hover:text-primary transition"
      >
        <ArrowBack size={16} />
        Back to Admin Console
      </Link>

      <div className="bg-panel border border-line rounded-2xl shadow-soft overflow-hidden">
        <div className="p-5 sm:p-6 bg-panel border-b border-line flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-glow shrink-0">
            {(profile.full_name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fg/50 mb-1 flex items-center gap-1.5">
              <UsersIcon size={12} /> Customer Profile
            </p>
            <h1 className="font-semibold text-xl leading-tight">{profile.full_name || 'Unnamed Customer'}</h1>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {detail(<MailIcon size={16} />, 'Email', profile.email)}
            {detail(<PhoneIcon size={16} />, 'Phone', profile.phone)}
            {detail(<MapPinIcon size={16} />, 'Preferred Location', profile.location || profile.profile.location)}
            {detail(
              <CalendarIcon size={16} />,
              'Registered',
              new Date(profile.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
            )}
          </div>

          {profile.profile.full_name && (
            <div className="bg-panel border border-line rounded-xl p-3.5 text-xs text-fg/70">
              Profile name on file: <strong className="text-fg">{profile.profile.full_name}</strong>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
