import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ShieldAlert, ShieldX, X, Loader2 } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unitId?: string;
  unitLabel: string;
  propertyName: string;
  status: 'available' | 'occupied' | 'unverified';
}

export const ContactRevealModal: React.FC<Props> = ({
  isOpen,
  onClose,
  unitId,
  unitLabel,
  propertyName,
  status,
}) => {
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && status === 'available' && unitId) {
      setLoading(true);
      setFetchError(null);
      api.getUnitContact(unitId)
        .then(res => setContactPhone(res.landlord_phone))
        .catch(err => setFetchError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, unitId, status]);

  if (!isOpen) return null;

  const whatsappMessage = encodeURIComponent(
    `Habari! I am inquiring about Unit ${unitLabel} at ${propertyName} listed on NyumbaPlug.`
  );
  const phone = contactPhone || '+254712345678';
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl border border-slate-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Contact — Unit {unitLabel}</h3>
        <p className="text-sm text-slate-500 mb-4">{propertyName}</p>

        {/* STATE A: AVAILABLE */}
        {status === 'available' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-nyumba-emeraldLight rounded-lg border border-nyumba-emerald/20">
              <VerifiedBadge size="md" />
              <p className="text-xs text-slate-600 mt-2">
                This property manager's identity has been cross-verified by NyumbaPlug admins.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6 text-slate-400">
                <Loader2 size={20} className="animate-spin mr-2" />
                <span className="text-xs">Loading contact details...</span>
              </div>
            ) : fetchError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {fetchError}
              </div>
            ) : (
              <>
                <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-200">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">Phone Number</span>
                  <span className="text-2xl font-mono font-bold text-slate-900">{phone}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center justify-center gap-2 bg-nyumba-emerald hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition"
                  >
                    <Phone size={18} />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition"
                  >
                    <MessageSquare size={18} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        {/* STATE B: OCCUPIED / RESERVED / MAINTENANCE */}
        {status === 'occupied' && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={24} />
              <div>
                <h4 className="font-semibold text-amber-900">Contact Details Gated</h4>
                <p className="text-sm text-amber-800 mt-1">
                  This unit is currently occupied, reserved, or undergoing maintenance. Contact info is withheld to prevent fraudulent pre-booking deposits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STATE C: UNVERIFIED LANDLORD */}
        {status === 'unverified' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <ShieldX className="text-red-600 shrink-0 mt-0.5" size={24} />
              <div>
                <h4 className="font-semibold text-red-900">Property Manager Verification Pending</h4>
                <p className="text-sm text-red-800 mt-1">
                  Contact details are locked because this property manager profile is unverified or has been revoked.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
