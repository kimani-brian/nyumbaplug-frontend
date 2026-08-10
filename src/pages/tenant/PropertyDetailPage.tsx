import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, ExternalLink, ShieldCheck, ChevronRight, Flag } from 'lucide-react';
import { Property, UnitCategory } from '../../types';
import { api } from '../../services/api';
import { ContactRevealModal } from '../../components/common/ContactRevealModal';
import { ReportModal } from '../../components/tenant/ReportModal';
import { Reveal } from '../../components/common/Reveal';
import { optimizeImageUrl } from '../../utils/image';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [categories, setCategories] = useState<UnitCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
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

  const totalUnits = categories.reduce((sum, c) => sum + c.quantity_available, 0);
  const minRent = categories.length > 0 ? Math.min(...categories.map(c => Number(c.rent_amount))) : 0;

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
          <img src={optimizeImageUrl(property.image_url) ?? property.image_url} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-nyumba-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-nyumba-ink/95 via-nyumba-ink/40 to-transparent" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 pt-24">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-white/95 text-primary-dark text-[11px] font-bold px-2.5 py-1 rounded-full">
              <ShieldCheck size={12} />
              Verified Property Manager
            </span>
            <span className="bg-white/10 text-white border border-white/20 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
              {totalUnits} {totalUnits === 1 ? 'unit' : 'units'} available
            </span>
          </div>
          <h1 className="display text-white font-bold text-3xl sm:text-5xl leading-tight">
            {property.name}
          </h1>
          <p className="flex items-center gap-1.5 text-white/85 text-sm mt-2">
            <MapPin size={15} />
            {textQuery}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8">
        {/* Main column */}
        <div className="space-y-8">
          {property.description && (
            <section>
              <h2 className="display font-bold text-2xl text-fg mb-3">About this property</h2>
              <p className="text-sm text-fg/70 leading-relaxed">{property.description}</p>
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${cat.quantity_available > 0 ? 'bg-primary text-white' : 'bg-red-500/20 text-red-400'}`}>
                        {cat.quantity_available > 0 ? 'Vacant' : 'Full'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-fg/60 leading-relaxed mb-3">{cat.description}</p>
                    )}
                    <div className="mt-auto pt-3 border-t border-line flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-fg/40 font-semibold block">Rent</span>
                        <span className="text-xl font-bold text-primary">
                          KES {Number(cat.rent_amount).toLocaleString()}
                          <span className="text-xs font-normal text-fg/40">/mo</span>
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsContactOpen(true);
                        }}
                        disabled={cat.quantity_available <= 0}
                        className="btn-primary !px-4 !py-2 disabled:opacity-40"
                      >
                        <Phone size={14} />
                        Contact
                      </button>
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

        {/* Aside */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-5">
          <div className="bg-panel rounded-3xl border border-line p-6 shadow-soft">
            <p className="text-[10px] uppercase tracking-widest font-bold text-fg/40">Starting rent</p>
            <p className="display font-bold text-3xl text-fg mt-1">
              KES {Number(minRent).toLocaleString()}
              <span className="text-sm font-normal text-fg/40">/mo</span>
            </p>
            <p className="text-xs text-fg/60 mt-1">{totalUnits} units available now</p>

            <button
              onClick={() => {
                const first = categories[0];
                if (first) {
                  setSelectedCategory(first);
                  setIsContactOpen(true);
                }
              }}
              disabled={categories.length === 0 || categories.every(c => c.quantity_available <= 0)}
              className="btn-primary w-full mt-5 disabled:opacity-40"
            >
              <Phone size={16} />
              Contact property manager
            </button>

            <button
              onClick={() => setIsReportOpen(true)}
              className="btn-outline w-full mt-3 !border-line !text-fg/60 hover:!bg-panel-strong hover:!text-red-400"
            >
              <Flag size={15} />
              Report Scam
            </button>
          </div>

          <div className="bg-panel rounded-3xl border border-line p-5">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white p-2 rounded-xl shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-fg">Verified listing</h4>
                <p className="text-xs text-fg/60 mt-1 leading-relaxed">
                  This property is linked to a government ID-verified property manager. Contact details are only
                  revealed for vacant, verified units — so you'll never chase a ghost apartment.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {selectedCategory && (
        <ContactRevealModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          unitId={selectedCategory.id}
          unitLabel={selectedCategory.name}
          propertyName={property.name}
          status="available"
        />
      )}

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        propertyId={property.id}
        propertyName={property.name}
      />
    </main>
  );
};
