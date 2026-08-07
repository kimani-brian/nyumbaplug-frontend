import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, User, ShieldCheck, Building2, Boxes, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VerificationBanner } from '../../components/landlord/VerificationBanner';
import { ProfileForm } from '../../components/landlord/ProfileForm';
import { AddPropertyModal } from '../../components/landlord/AddPropertyModal';
import { CategoryManager } from '../../components/landlord/CategoryManager';
import { Property } from '../../types';
import { api } from '../../services/api';

export const LandlordDashboard: React.FC = () => {
  const { user, landlordProfile, setLandlordProfile } = useAuth() as any;
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [manageCategoriesFor, setManageCategoriesFor] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const totalUnits = properties.reduce(
    (sum, p) => sum + (p.categories ?? []).reduce((s, c) => s + c.quantity_available, 0),
    0
  );
  const availableUnits = properties.reduce(
    (sum, p) => sum + (p.categories ?? []).reduce((s, c) => s + c.quantity_available, 0),
    0
  );

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
    return (
      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 space-y-4">
        <div className="h-8 w-56 bg-slate-100 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(n => <div key={n} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </main>
    );
  }

  if (!landlordProfile) {
    return (
      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
        <ProfileForm onSuccess={profile => { setLandlordProfile?.(profile); loadData(); }} />
      </main>
    );
  }

  const stats = [
    { label: 'Properties', value: properties.length, icon: <Building2 size={16} className="text-nyumba-emerald" />, tint: 'bg-emerald-50 border-emerald-100' },
    { label: 'Total units', value: totalUnits, icon: <Boxes size={16} className="text-nyumba-terracotta" />, tint: 'bg-orange-50 border-orange-100' },
    { label: 'Available now', value: availableUnits, icon: <TrendingUp size={16} className="text-nyumba-navy" />, tint: 'bg-slate-100 border-slate-200' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-nyumba-emerald text-white flex items-center justify-center text-xl font-bold shadow-soft">
            {(landlordProfile.full_name || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-nyumba-terracotta mb-0.5">
              Dashboard
            </p>
            <h1 className="display font-semibold text-2xl text-nyumba-ink leading-tight">
              {landlordProfile.full_name || landlordProfile.page_name || 'Welcome back'}
            </h1>
            {landlordProfile.page_name && landlordProfile.page_name !== landlordProfile.full_name && (
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {landlordProfile.page_name}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-0.5">
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-nyumba-emerald font-semibold">
                  <ShieldCheck size={12} /> Verified Property Manager
                </span>
              ) : (
                'Awaiting verification'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/account')}
            className="btn-outline !py-2.5"
          >
            <User size={14} />
            Edit profile
          </button>
          <button
            disabled={!isVerified}
            onClick={() => setIsAddPropertyOpen(true)}
            className="btn-primary !py-2.5 disabled:opacity-40"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-white rounded-2xl border ${s.tint} p-4 flex items-center gap-3`}>
            <div className="bg-white rounded-xl p-2.5 shadow-sm shrink-0">{s.icon}</div>
            <div>
              <div className="display font-bold text-2xl text-nyumba-ink leading-none">{s.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <VerificationBanner profile={landlordProfile} />

      {/* Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display font-semibold text-xl text-nyumba-ink">
            Your properties <span className="text-slate-400 font-normal">({properties.length})</span>
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-nyumba-line">
            <div className="bg-nyumba-sand w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={22} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-semibold text-sm">
              {isVerified ? 'No properties yet' : 'Properties will appear once verified'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {isVerified
                ? 'Click "Add Property" to create your first listing.'
                : 'Your profile is still under review by our team.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(property => (
              <div key={property.id} className="bg-white rounded-2xl border border-nyumba-line shadow-soft overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-64 shrink-0 relative aspect-[16/10] sm:aspect-auto bg-nyumba-sand">
                    {property.image_url ? (
                      <img src={property.image_url} alt={property.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={28} className="text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h3 className="display font-semibold text-lg text-nyumba-ink">{property.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{property.location}{property.county ? ` · ${property.county}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditProperty(property)}
                          className="p-2 text-slate-400 hover:text-nyumba-emerald hover:bg-nyumba-emeraldLight rounded-lg transition"
                          title="Edit property"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          disabled={deleting === property.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete property"
                        >
                          <Trash2 size={15} />
                        </button>
                        {isVerified && (
                          <button
                            onClick={() => setManageCategoriesFor(property.id)}
                            className="btn-dark !px-4 !py-2"
                          >
                            <Boxes size={14} />
                            Manage categories
                          </button>
                        )}
                      </div>
                    </div>

                    {property.categories && property.categories.length > 0 ? (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {property.categories.map(cat => (
                          <div key={cat.id} className="p-3 bg-nyumba-cream rounded-xl border border-nyumba-line">
                            <div className="font-bold text-sm text-nyumba-ink">{cat.name}</div>
                            <div className="text-xs text-nyumba-emerald font-semibold mt-0.5">
                              KES {Number(cat.rent_amount).toLocaleString()}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{cat.quantity_available} available</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mt-3">
                        No categories yet.{isVerified ? ' Manage categories to add units and pricing.' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
