import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Phone, ExternalLink } from 'lucide-react';
import { Property, UnitCategory } from '../../types';
import { api } from '../../services/api';
import { ContactRevealModal } from '../../components/common/ContactRevealModal';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [categories, setCategories] = useState<UnitCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
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
        <p className="text-slate-500 text-sm">{error}</p>
        <Link to="/" className="text-nyumba-emerald font-semibold text-sm mt-4 inline-block">← Back to search</Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white h-80 rounded-xl animate-pulse border border-slate-200" />
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} />
        Back to all listings
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="aspect-[21/9] bg-slate-100 overflow-hidden relative">
          {property.image_url && (
            <img src={property.image_url} alt={property.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{property.name}</h1>
              <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                <MapPin size={16} className="text-slate-400" />
                <span>{textQuery}</span>
              </p>
            </div>
          </div>

          {property.description && (
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{property.description}</p>
          )}

          <div className="mb-6 rounded-xl overflow-hidden border border-slate-200">
            <iframe
              title="Property location"
              src={embedUrl}
              width="100%"
              height="280"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-nyumba-emerald transition"
            >
              <ExternalLink size={14} />
              Open in Google Maps
            </a>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Unit Categories</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-4 rounded-xl border transition flex items-center justify-between bg-slate-50 border-slate-200"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{cat.name}</span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-500">{cat.description}</p>
                  )}
                  <p className="text-base font-bold text-nyumba-emerald mt-1">KES {Number(cat.rent_amount).toLocaleString()}<span className="text-xs font-normal text-slate-500">/mo</span></p>
                  <p className="text-xs text-slate-400">{cat.quantity_available} available</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsContactOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition bg-nyumba-emerald hover:bg-emerald-700 text-white shadow"
                >
                  <Phone size={14} />
                  <span>Contact</span>
                </button>
              </div>
            ))}
          </div>
        </div>
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
    </main>
  );
};
