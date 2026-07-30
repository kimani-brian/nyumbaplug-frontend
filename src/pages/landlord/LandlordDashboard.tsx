import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2, Pencil, User, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VerificationBanner } from '../../components/landlord/VerificationBanner';
import { ProfileForm } from '../../components/landlord/ProfileForm';
import { AddPropertyModal } from '../../components/landlord/AddPropertyModal';
import { CategoryManager } from '../../components/landlord/CategoryManager';
import { Property } from '../../types';
import { api } from '../../services/api';

export const LandlordDashboard: React.FC = () => {
  const { user, landlordProfile, setLandlordProfile } = useAuth() as any;
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [manageCategoriesFor, setManageCategoriesFor] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'landlord') {
        const profile = await api.getMyLandlordProfile();
        if (setLandlordProfile) setLandlordProfile(profile);
        if (profile) {
          const props = await api.getLandlordProperties();
          setProperties(props);
        }
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const isVerified = landlordProfile?.verification_status === 'verified';

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm('Delete this property and all its categories? This cannot be undone.')) return;
    setDeleting(propertyId);
    try {
      await api.deleteProperty(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch {
      // handle error
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-400">Loading dashboard...</div>;
  }

  if (!landlordProfile) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileForm onSuccess={profile => { setLandlordProfile?.(profile); loadData(); }} />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agent Dashboard</h1>
          <p className="text-xs text-slate-500">Manage your properties and unit categories</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            disabled={!isVerified}
            onClick={() => setIsAddPropertyOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
              isVerified ? 'bg-nyumba-emerald hover:bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus size={18} />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      <VerificationBanner profile={landlordProfile} />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-nyumba-emeraldLight p-2 rounded-lg">
              <User size={20} className="text-nyumba-emerald" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{landlordProfile.full_name || 'Agent'}</p>
              <p className="text-[10px] text-slate-500">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-nyumba-emerald font-semibold">
                    <ShieldCheck size={12} /> Verified Agent
                  </span>
                ) : (
                  'Pending verification'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            className="text-xs font-semibold text-nyumba-emerald hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowEditProfile(false)}>
          <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setShowEditProfile(false)}
                className="absolute -top-2 -right-2 z-10 bg-white border border-slate-200 rounded-full p-1 shadow hover:bg-slate-100"
              >
                <X size={16} className="text-slate-500" />
              </button>
              <ProfileForm
                profile={landlordProfile}
                onSuccess={updated => {
                  setLandlordProfile?.(updated);
                  setShowEditProfile(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Your Properties ({properties.length})</h2>

        {properties.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            {isVerified
              ? 'No properties yet. Click "Add Property" to get started.'
              : 'Properties will appear here once your profile is verified.'}
          </div>
        )}

        {properties.map(property => (
          <div key={property.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{property.name}</h3>
                <p className="text-xs text-slate-500">{property.location}{property.county ? ` · ${property.county}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditProperty(property)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                  title="Edit property"
                >
                  <Pencil size={15} />
                </button>
                {isVerified && (
                  <button
                    onClick={() => setManageCategoriesFor(property.id)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    Manage Categories
                  </button>
                )}
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  disabled={deleting === property.id}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete property"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {property.categories && property.categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {property.categories.map(cat => (
                  <div key={cat.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-sm text-slate-900">{cat.name}</div>
                    <div className="text-xs text-slate-500">KES {Number(cat.rent_amount).toLocaleString()}</div>
                    <div className="text-xs text-slate-400">{cat.quantity_available} available</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No categories yet. Click "Manage Categories" to add some.</p>
            )}
          </div>
        ))}
      </div>

      <AddPropertyModal
        isOpen={isAddPropertyOpen || !!editProperty}
        onClose={() => { setIsAddPropertyOpen(false); setEditProperty(null); }}
        landlordId={landlordProfile?.id || ''}
        onSuccess={loadData}
        property={editProperty}
      />
      {manageCategoriesFor && (
        <CategoryManager
          propertyId={manageCategoriesFor}
          onClose={() => setManageCategoriesFor(null)}
          onSuccess={loadData}
        />
      )}
    </main>
  );
};
