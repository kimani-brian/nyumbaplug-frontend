import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowBack, Building2Icon, ShieldCheckIcon, ClockIcon, AlertOctagonIcon, FileTextIcon, ExternalLinkIcon, EyeIcon, XCircleIcon, MailIcon, PhoneIcon } from '../../utils/icons';
import { PropertyManagerDetail } from '../../types';
import { api } from '../../services/api';
import { RevokeModal } from '../../components/admin/RevokeModal';

export const PropertyManagerProfilePage: React.FC = () => {
  const { landlordId } = useParams<{ landlordId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PropertyManagerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRevoke, setShowRevoke] = useState(false);

  useEffect(() => {
    if (landlordId) {
      api.getPropertyManagerProfile(landlordId)
        .then(setProfile)
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    }
  }, [landlordId]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-fg/50">Loading...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-fg/50">Property manager not found.</p>
        <Link to="/admin" className="text-xs text-primary font-semibold">Back to Admin Console</Link>
      </main>
    );
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: 'bg-primary text-white',
      pending: 'bg-amber-500/20 text-amber-400',
      revoked: 'bg-red-500/20 text-red-400',
    };
    const icons: Record<string, React.ReactNode> = {
      verified: <ShieldCheckIcon size={14} />,
      pending: <ClockIcon size={14} />,
      revoked: <AlertOctagonIcon size={14} />,
    };
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${styles[status] || ''}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg/60 hover:text-fg mb-6"
      >
        <ArrowBack size={16} />
        Back to Admin Console
      </Link>

      <div className="bg-panel rounded-2xl border border-line shadow-soft overflow-hidden">
        <div className="p-5 bg-panel-strong border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2Icon size={20} className="text-primary" />
            <h1 className="text-lg font-bold">{profile.full_name || 'Property Manager Profile'}</h1>
          </div>
          {statusBadge(profile.verification_status)}
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[10px] uppercase font-semibold text-fg/40 block">Full Name</span>
              <span className="text-fg font-medium">{profile.full_name || '—'}</span>
            </div>
            {profile.page_name && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-fg/40 block">Page Name</span>
                <span className="text-fg font-medium">{profile.page_name}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-semibold text-fg/40 block">National ID</span>
              <span className="text-fg font-medium font-mono">{profile.national_id_number}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-fg/40 block">Email</span>
              <span className="text-fg flex items-center gap-1">
                <MailIcon size={13} className="text-fg/40" />
                {profile.email || '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-fg/40 block">Phone</span>
              <span className="text-fg flex items-center gap-1">
                <PhoneIcon size={13} className="text-fg/40" />
                {profile.phone || '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-fg/40 block">Caretaker</span>
              <span className="text-fg">{profile.is_caretaker ? 'Yes' : 'No'}</span>
            </div>
            {profile.is_caretaker && profile.authorized_by_landlord_id && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-fg/40 block">Authorized By</span>
                <span className="text-fg font-mono text-[11px]">{profile.authorized_by_landlord_id}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-semibold text-fg/40 block">Registered</span>
              <span className="text-fg">{new Date(profile.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            {profile.verified_at && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-fg/40 block">Verified At</span>
                <span className="text-fg">{new Date(profile.verified_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            )}
            {profile.revoked_at && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-fg/40 block">Revoked At</span>
                <span className="text-fg">{new Date(profile.revoked_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>

          {profile.revoke_reason && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
              <strong>Revoke Reason:</strong> {profile.revoke_reason}
            </div>
          )}

          {profile.id_document_url && (
            <a
              href={profile.id_document_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary bg-primary-light border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition"
            >
              <FileTextIcon size={14} />
              <span>View ID Document</span>
              <ExternalLinkIcon size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => navigate(`/admin/property-managers/${landlordId}/properties`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-panel-strong border border-primary/20 px-3 py-2 rounded-lg hover:bg-primary/20 transition"
        >
          <EyeIcon size={14} />
          View Properties
        </button>
        {profile.verification_status === 'revoked' && (
          <button
            onClick={async () => {
              if (!window.confirm('Verify this property manager? They will regain access to list properties.')) return;
              try {
                await api.approveLandlord(landlordId!);
                const updated = await api.getPropertyManagerProfile(landlordId!);
                setProfile(updated);
              } catch (e: any) {
                alert(e.message || 'Failed to verify property manager');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-panel-strong border border-primary/20 px-3 py-2 rounded-lg hover:bg-primary/20 transition"
          >
            <ShieldCheckIcon size={14} />
            Verify Property Manager
          </button>
        )}
        {profile.verification_status !== 'revoked' && (
          <button
            onClick={() => setShowRevoke(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg hover:bg-red-500/20 transition"
          >
            <XCircleIcon size={14} />
            Revoke Property Manager
          </button>
        )}
      </div>

      <RevokeModal
        isOpen={showRevoke}
        onClose={() => setShowRevoke(false)}
        landlord={profile}
        onSuccess={() => {
          setShowRevoke(false);
          api.getPropertyManagerProfile(landlordId!).then(setProfile);
        }}
      />
    </main>
  );
};
