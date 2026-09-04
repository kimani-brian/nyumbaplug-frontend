import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, User, ShieldCheck, Building2, Boxes, TrendingUp, PhoneIncoming, Check, Phone, Mail, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileForm } from '../../components/landlord/ProfileForm';
import { AddPropertyModal } from '../../components/landlord/AddPropertyModal';
import { CategoryManager } from '../../components/landlord/CategoryManager';
import { Property, CallRequestView, MessageView } from '../../types';
import { api } from '../../services/api';
import { resolveMediaUrl } from '../../utils/image';

export const LandlordDashboard: React.FC = () => {
  const { user, landlordProfile, setLandlordProfile } = useAuth() as any;
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [callRequests, setCallRequests] = useState<CallRequestView[]>([]);
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [messagesOpen, setMessagesOpen] = useState(true);
  const [callRequestsOpen, setCallRequestsOpen] = useState(true);
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
          api.getCallRequests().then(setCallRequests).catch(() => {});
          api.getMessages().then(setMessages).catch(() => {});
        }
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  useEffect(() => {
    if (user?.role !== 'landlord') return;
    const refreshMessages = () => api.getMessages().then(setMessages).catch(() => {});
    const interval = window.setInterval(refreshMessages, 15000);
    return () => window.clearInterval(interval);
  }, [user]);

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

  const newCallRequests = callRequests.filter(r => r.status === 'new');
  const newMessages = messages.filter(m => m.status === 'unread');

  const handleMarkContacted = async (requestId: string) => {
    try {
      await api.markCallRequestContacted(requestId);
      setCallRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'contacted' as const } : r)));
    } catch {
      // handle error
    }
  };

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      await api.markMessageRead(messageId);
      setMessages(prev => prev.map(message => (
        message.id === messageId ? { ...message, status: 'read' as const } : message
      )));
    } catch {
      // Keep the message unread if the server could not save the change.
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 space-y-4">
        <div className="h-8 w-56 bg-panel-strong rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(n => <div key={n} className="h-24 bg-panel-strong rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-panel-strong rounded-2xl animate-pulse" />
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
    { label: 'Properties', value: properties.length, icon: <Building2 size={16} className="text-primary" />, tint: '' },
    { label: 'Total units', value: totalUnits, icon: <Boxes size={16} className="text-primary" />, tint: '' },
    { label: 'Available now', value: availableUnits, icon: <TrendingUp size={16} className="text-primary" />, tint: '' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-glow">
            {(landlordProfile.full_name || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-0.5">
              Dashboard
            </p>
            <h1 className="display font-semibold text-2xl text-fg leading-tight">
              {landlordProfile.full_name || landlordProfile.page_name || 'Welcome back'}
            </h1>
            {landlordProfile.page_name && landlordProfile.page_name !== landlordProfile.full_name && (
              <p className="text-xs font-semibold text-fg/60 mt-0.5">
                {landlordProfile.page_name}
              </p>
            )}
            <p className="text-xs text-fg/60 mt-0.5">
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-primary font-semibold">
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
          <div key={s.label} className="bg-panel rounded-2xl border border-line p-4 flex items-center gap-3">
            <div className="bg-panel-strong rounded-xl p-2.5 shadow-sm shrink-0">{s.icon}</div>
            <div>
              <div className="display font-bold text-2xl text-fg leading-none">{s.value}</div>
              <div className="text-[11px] text-fg/50 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Tenant message notifications */}
        {messages.length > 0 && (
          <div className="bg-panel border border-line rounded-2xl shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-panel-strong/50">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <h2 className="font-bold text-sm text-fg">Tenant messages</h2>
                {newMessages.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {newMessages.length} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => api.getMessages().then(setMessages).catch(() => {})}
                  className="p-1.5 text-fg/40 hover:text-primary transition"
                  title="Refresh messages"
                  aria-label="Refresh messages"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setMessagesOpen(open => !open)}
                  className="p-1.5 text-fg/40 hover:text-primary transition"
                  title={messagesOpen ? 'Collapse messages' : 'Show messages'}
                  aria-label={messagesOpen ? 'Collapse messages' : 'Show messages'}
                  aria-expanded={messagesOpen}
                >
                  {messagesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
            {messagesOpen && <div className="divide-y divide-line max-h-96 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className="flex flex-col gap-2 px-5 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${msg.status === 'unread' ? 'bg-blue-500' : 'bg-emerald-400'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-fg">
                        {msg.tenant_name}
                        <span className="text-fg/40 font-normal"> · {msg.unit_name} at {msg.property_name}</span>
                      </p>
                      <p className="text-sm text-fg/70 mt-1 whitespace-pre-wrap break-words">{msg.message}</p>
                      <p className="text-xs text-fg/40 mt-1">
                        {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 ml-5">
                    <a href={`tel:${msg.tenant_phone}`} className="text-sm font-mono font-semibold text-primary hover:underline">
                      {msg.tenant_phone}
                    </a>
                    {msg.status === 'unread' ? (
                      <button onClick={() => handleMarkMessageRead(msg.id)} className="btn-outline !px-3 !py-1.5 !text-xs shrink-0">
                        Mark as read
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                        Read
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            }
          </div>
        )}

        {/* Callback request notifications */}
        {callRequests.length > 0 && (
          <div className="bg-panel border border-line rounded-2xl shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-panel-strong/50">
              <div className="flex items-center gap-2">
                <PhoneIncoming size={16} className="text-primary" />
                <h2 className="font-bold text-sm text-fg">Callback requests</h2>
                {newCallRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {newCallRequests.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCallRequestsOpen(open => !open)}
                className="p-1.5 text-fg/40 hover:text-primary transition"
                title={callRequestsOpen ? 'Collapse callback requests' : 'Show callback requests'}
                aria-label={callRequestsOpen ? 'Collapse callback requests' : 'Show callback requests'}
                aria-expanded={callRequestsOpen}
              >
                {callRequestsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {callRequestsOpen && <div className="divide-y divide-line max-h-96 overflow-y-auto">
            {callRequests.map(req => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3.5">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${req.status === 'new' ? 'bg-blue-500' : 'bg-emerald-400'}`}
                  title={req.status === 'new' ? 'New' : 'Contacted'}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg truncate">
                    {req.tenant_name}
                    <span className="text-fg/40 font-normal"> · wants a call back</span>
                  </p>
                  <p className="text-xs text-fg/50 truncate">
                    {req.property_name}
                    {req.unit_name ? ` · ${req.unit_name}` : ''}
                    <span className="text-fg/30"> · {new Date(req.created_at).toLocaleDateString()} {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
                <a
                  href={`tel:${req.tenant_phone}`}
                  className="text-sm font-mono font-semibold text-primary hover:underline shrink-0"
                >
                  {req.tenant_phone}
                </a>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={`tel:${req.tenant_phone}`} className="btn-outline !px-3 !py-1.5 !text-xs">
                    <Phone size={12} />
                    Call
                  </a>
                  {req.status === 'new' ? (
                    <button onClick={() => handleMarkContacted(req.id)} className="btn-primary !px-3 !py-1.5 !text-xs">
                      <Check size={12} />
                      Mark contacted
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Contacted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>}
          </div>
        )}
      </div>

      {/* Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display font-semibold text-xl text-fg">
            Your properties <span className="text-fg/40 font-normal">({properties.length})</span>
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 bg-panel rounded-2xl border border-line">
            <div className="bg-panel-strong w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={22} className="text-fg/40" />
            </div>
            <p className="text-fg/80 font-semibold text-sm">
              {isVerified ? 'No properties yet' : 'Properties will appear once verified'}
            </p>
            <p className="text-xs text-fg/50 mt-1 max-w-sm mx-auto">
              {isVerified
                ? 'Click "Add Property" to create your first listing.'
                : 'Your profile is still under review by our team.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(property => (
              <div key={property.id} className="bg-panel border border-line rounded-2xl shadow-soft overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-64 shrink-0 relative aspect-[16/10] sm:aspect-auto bg-nyumba-ink">
                    {property.image_url ? (
                      <>
                        <img src={resolveMediaUrl(property.image_url) ?? property.image_url} alt={property.name} className="w-full h-full object-cover" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={28} className="text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h3 className="display font-semibold text-lg text-fg">{property.name}</h3>
                        <p className="text-xs text-fg/50 mt-0.5">{property.location}{property.county ? ` · ${property.county}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditProperty(property)}
                          className="p-2 text-fg/40 hover:text-primary hover:bg-panel-strong rounded-lg transition"
                          title="Edit property"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          disabled={deleting === property.id}
                          className="p-2 text-fg/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
                          <div key={cat.id} className="p-3 bg-panel rounded-xl border border-line">
                            <div className="font-bold text-sm text-fg">{cat.name}</div>
                            <div className="text-xs text-primary font-semibold mt-0.5">
                              KES {Number(cat.rent_amount).toLocaleString()}
                            </div>
                            <div className="text-[11px] text-fg/40 mt-0.5">{cat.quantity_available} available</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-fg/40 mt-3">
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
