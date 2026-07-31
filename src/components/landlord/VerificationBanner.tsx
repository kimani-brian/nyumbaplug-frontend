import React from 'react';
import { ShieldCheck, Clock, AlertOctagon } from 'lucide-react';
import { LandlordProfile } from '../../types';

interface Props {
  profile: LandlordProfile;
}

export const VerificationBanner: React.FC<Props> = ({ profile }) => {
  if (profile.verification_status === 'verified') {
    return (
      <div className="bg-nyumba-emeraldLight border border-nyumba-emerald/30 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-nyumba-emerald text-white p-2.5 rounded-xl shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="font-bold text-nyumba-ink text-sm">Agent profile verified</h3>
            <p className="text-xs text-slate-600">
              Your identity is confirmed. All your properties and vacant units are visible to customers.
            </p>
          </div>
        </div>
        {profile.is_caretaker && (
          <span className="text-xs font-medium bg-white text-slate-700 px-3 py-1.5 rounded-full border border-nyumba-line shrink-0">
            Caretaker for: <strong className="text-nyumba-emerald">{profile.authorizer_name || 'Primary Agent'}</strong>
          </span>
        )}
      </div>
    );
  }

  if (profile.verification_status === 'pending') {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="bg-amber-500 text-white p-2.5 rounded-xl shrink-0">
            <Clock size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 text-sm">Verification under review</h3>
            <p className="text-xs text-amber-800 mt-1">
              Your National ID submission is in the admin review queue. You cannot add properties or reveal contact numbers until an admin approves your profile.
            </p>
            {profile.is_caretaker && (
              <p className="text-xs font-semibold text-amber-900 mt-2 bg-amber-100 inline-block px-2.5 py-1 rounded">
                Authorizing Agent: {profile.authorizer_name}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 p-4 sm:p-5 rounded-2xl">
      <div className="flex items-start gap-3">
        <div className="bg-red-600 text-white p-2.5 rounded-xl shrink-0">
          <AlertOctagon size={22} />
        </div>
        <div>
          <h3 className="font-bold text-red-900 text-sm">Agent profile revoked</h3>
          <p className="text-xs text-red-800 mt-1">
            Reason: <strong className="underline">{profile.revoke_reason || 'Safety compliance failure'}</strong>.
            All your listed properties have been automatically hidden from customer search.
          </p>
        </div>
      </div>
    </div>
  );
};
