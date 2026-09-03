import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, ExternalLink, ChevronRight, Images, MessageSquare } from 'lucide-react';
import { Property, UnitCategory } from '../../types';
import { api } from '../../services/api';
import { CallBackModal } from '../../components/common/CallBackModal';
import { MessageModal } from '../../components/common/MessageModal';
import { ReportModal } from '../../components/tenant/ReportModal';
import { MediaGalleryModal } from '../../components/common/MediaGalleryModal';
import { Reveal } from '../../components/common/Reveal';
import { optimizeImageUrl, resolveMediaUrl } from '../../utils/image';

// WhatsApp brand glyph (lucide has no brand icons).
const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.51 14.94L2 22l5.2-1.49A9.9 9.9 0 1 0 12.04 2Zm5.77 14.06c-.24.68-1.4 1.3-1.93 1.35-.52.05-1.01.24-3.4-.71-2.87-1.13-4.7-4.06-4.84-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09 1-2.38.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.48.24.58.81 1.99.88 2.13.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.39-.44.52-.15.14-.3.3-.13.59.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.33 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.09 1.67.79 1.96.93.29.15.48.22.55.34.07.12.07.7-.17 1.37Z" />
  </svg>
);

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [categories, setCategories] = useState<UnitCategory[]>([]);
  const [galleryCategory, setGalleryCategory] = useState<UnitCategory | null>(null);
  const [callbackCategory, setCallbackCategory] = useState<UnitCategory | null>(null);
  const [messageCategory, setMessageCategory] = useState<UnitCategory | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.getPropertyDetail(id)
        .then(res => {
          setProperty(res.property);
          setCategories(res.categories || []);
        })
        .catch(() => setError('Property not found or unavailable.'));
    }
  }, [id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-fg/60 text-sm">{error}</p>
        <Link to="/properties" className="text-primary font-semibold text-sm mt-4 inline-block">← Back to listings</Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-6 w-48 bg-panel-strong rounded animate-pulse mb-6" />
        <div className="bg-panel-strong h-96 rounded-3xl animate-pulse border border-line" />
      </div>
    );
  }

  const locationParts = [property.location, property.county, property.address].filter(Boolean);
  const textQuery = locationParts.join(', ');
  const mapQuery = property.map_coords || textQuery;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const directionsUrl = property.map_coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${property.map_coords}`
    : `https://www.google.com/maps/search/${encodeURIComponent(textQuery)}`;


  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-fg/50 mb-6">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight size={12} />
        <Link to="/properties" className="hover:text-primary transition">Listings</Link>
        <ChevronRight size={12} />
        <span className="text-fg/70 font-medium line-clamp-1">{property.name}</span>
      </nav>

      {/* Hero image + title */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] bg-nyumba-ink shadow-lift">
        {property.image_url ? (
          <img src={optimizeImageUrl(resolveMediaUrl(property.image_url)) ?? property.image_url} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-nyumba-ink" />
        )}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 pt-24">
          <h1 className="display text-white font-bold text-3xl sm:text-5xl leading-tight">
            {property.name}
          </h1>
          <p className="flex items-center gap-1.5 text-white/85 text-sm mt-2">
            <MapPin size={15} />
            {textQuery}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-8">
        {/* Main column */}
        <div className="space-y-8">
           {property.description && (
             <section>
              <h2 className="display font-bold text-2xl text-fg mb-3">Description</h2>
              <div className="bg-panel-strong border border-line rounded-2xl p-5">
                <p className="text-sm text-fg/70 leading-relaxed">{property.description}</p>
              </div>
            </section>
          )}

          <section>
            <h2 className="display font-bold text-2xl text-fg mb-4">
              Units & pricing
            </h2>
            {categories.length === 0 ? (
              <p className="text-sm text-fg/60 bg-panel rounded-3xl border border-line p-6">
                Unit categories have not been added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat, i) => (
                  <Reveal key={cat.id} delay={(i % 2) * 120}>
                    <div
                      className="bg-panel rounded-3xl border border-line p-5 shadow-soft hover:shadow-lift transition-all hover:-translate-y-0.5 flex flex-col"
                    >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="display font-bold text-lg text-fg">{cat.name}</h3>
                      <button
                        onClick={() => setGalleryCategory(cat)}
                        title={cat.photos?.length || cat.video_url ? 'View pics & videos' : 'No media uploaded yet'}
                        className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                          cat.photos?.length > 0 || cat.video_url
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            : 'border border-dashed border-blue-300 bg-blue-50 text-blue-500 hover:bg-blue-100'
                        }`}
                      >
                        <Images size={14} />
                        Pics &amp; Videos
                      </button>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-fg/60 leading-relaxed mb-3">{cat.description}</p>
                    )}
                    <div className="mt-auto pt-3 border-t border-line flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-fg/40 font-semibold block">Rent</span>
                        <span className="text-xl font-bold text-primary">
                          KES {Number(cat.rent_amount).toLocaleString()}
                          <span className="text-xs font-normal text-fg/40">/mo</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-1">
                          <button
                            onClick={() => setCallbackCategory(cat)}
                            title="Request a call back"
                            className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <Phone size={18} />
                          </button>
                          <button
                            onClick={() => setMessageCategory(cat)}
                            title="Send a message"
                            className="p-3 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
                          >
                            <MessageSquare size={18} />
                          </button>
                          <button
                            onClick={() => {
                              api.getUnitContact(cat.id).then(res => {
                                const phone = res.landlord_phone.replace(/[^0-9]/g, '');
                                const msg = encodeURIComponent("Hi, I'd like to know more about this unit. Please get in touch with me.");
                                window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                              }).catch(() => {});
                            }}
                            title="Chat on WhatsApp"
                            className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
                          >
                            <WhatsAppIcon size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="display font-bold text-2xl text-fg mb-4">Location</h2>
            <div className="rounded-3xl overflow-hidden border border-line shadow-soft">
              <iframe
                title="Property location"
                src={embedUrl}
                width="100%"
                height="300"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 bg-panel hover:bg-panel-strong text-xs font-semibold text-primary transition border-t border-line"
              >
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
</div>
      </section>
        </div>
        </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        propertyId={property.id}
        propertyName={property.name}
      />

      <MediaGalleryModal
        category={galleryCategory}
        onClose={() => setGalleryCategory(null)}
      />

      {callbackCategory && (
        <CallBackModal
          isOpen={!!callbackCategory}
          onClose={() => setCallbackCategory(null)}
          propertyId={property.id}
          unitId={callbackCategory.id}
          propertyName={property.name}
        />
      )}

      {messageCategory && (
        <MessageModal
          isOpen={!!messageCategory}
          onClose={() => setMessageCategory(null)}
          unitId={messageCategory.id}
          propertyName={property.name}
        />
      )}
    </main>
  );
};
