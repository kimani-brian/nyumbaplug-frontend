import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, ShieldCheck, Clock, AlertOctagon, FileText, ExternalLink, Eye, XCircle, Mail, Phone } from 'lucide-react';
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
        <p className="text-sm text-slate-400">Loading...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-slate-400">Property manager not found.</p>
        <Link to="/admin" className="text-xs text-nyumba-emerald font-semibold">Back to Admin Console</Link>
      </main>
    );
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      revoked: 'bg-red-100 text-red-800',
    };
    const icons: Record<string, React.ReactNode> = {
      verified: <ShieldCheck size={14} />,
      pending: <Clock size={14} />,
      revoked: <AlertOctagon size={14} />,
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
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Admin Console
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-nyumba-emerald" />
            <h1 className="text-lg font-bold">{profile.full_name || 'Property Manager Profile'}</h1>
          </div>
          {statusBadge(profile.verification_status)}
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Full Name</span>
              <span className="text-slate-900 font-medium">{profile.full_name || '—'}</span>
            </div>
            {profile.page_name && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Page Name</span>
                <span className="text-slate-900 font-medium">{profile.page_name}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">National ID</span>
              <span className="text-slate-900 font-medium font-mono">{profile.national_id_number}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Email</span>
              <span className="text-slate-900 flex items-center gap-1">
                <Mail size={13} className="text-slate-400" />
                {profile.email || '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Phone</span>
              <span className="text-slate-900 flex items-center gap-1">
                <Phone size={13} className="text-slate-400" />
                {profile.phone || '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Caretaker</span>
              <span className="text-slate-900">{profile.is_caretaker ? 'Yes' : 'No'}</span>
            </div>
            {profile.is_caretaker && profile.authorized_by_landlord_id && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Authorized By</span>
                <span className="text-slate-900 font-mono text-[11px]">{profile.authorized_by_landlord_id}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Registered</span>
              <span className="text-slate-900">{new Date(profile.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            {profile.verified_at && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Verified At</span>
                <span className="text-slate-900">{new Date(profile.verified_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            )}
            {profile.revoked_at && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Revoked At</span>
                <span className="text-slate-900">{new Date(profile.revoked_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>

          {profile.revoke_reason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              <strong>Revoke Reason:</strong> {profile.revoke_reason}
            </div>
          )}

          {profile.id_document_url && (
            <a
              href={profile.id_document_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              <FileText size={14} />
              <span>View ID Document</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => navigate(`/admin/property-managers/${landlordId}/properties`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-nyumba-emerald bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition"
        >
          <Eye size={14} />
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
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition"
          >
            <ShieldCheck size={14} />
            Verify Property Manager
          </button>
        )}
        {profile.verification_status !== 'revoked' && (
          <button
            onClick={() => setShowRevoke(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 transition"
          >
            <XCircle size={14} />
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
