import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck } from 'lucide-react';
import { Property } from '../../types';
import { optimizeImageUrl } from '../../utils/image';

interface Props {
  property: Property;
}

export const PropertyCard: React.FC<Props> = ({ property }) => {
  const categories = property.categories || [];
  const minRent = property.min_rent ??
    (categories.length > 0 ? Math.min(...categories.map(c => Number(c.rent_amount))) : 0);
  const totalUnits = property.total_units ??
    categories.reduce((sum, c) => sum + c.quantity_available, 0);

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group bg-panel border border-line rounded-3xl overflow-hidden shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] bg-nyumba-ink overflow-hidden">
        {property.image_url ? (
          <img
            src={optimizeImageUrl(property.image_url) ?? property.image_url}
            alt={property.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-nyumba-ink flex items-center justify-center">
            <MapPin size={28} className="text-white/20" />
          </div>
        )}
        {property.image_url && <div className="absolute inset-0 bg-gradient-to-t from-page/70 via-page/10 to-transparent" />}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-nyumba-ink/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/10">
          <ShieldCheck size={11} className="text-primary" />
          Verified Property Manager
        </div>
        <div className="absolute bottom-3 right-3 bg-nyumba-ink/85 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur">
          {totalUnits} {totalUnits === 1 ? 'UNIT' : 'UNITS'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="display font-bold text-lg text-fg leading-snug mb-1">
          {property.name}
        </h3>
        <p className="flex items-center gap-1 text-xs text-fg/50 mb-3">
          <MapPin size={14} className="text-fg/40 shrink-0" />
          <span className="line-clamp-1">{property.location}{property.county ? `, ${property.county}` : ''}</span>
        </p>
        <p className="text-xs text-fg/60 line-clamp-2 mb-4 flex-1">{property.description}</p>

        <div className="pt-4 border-t border-line flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-fg/40 font-semibold block">Rent from</span>
            <span className="text-lg font-bold text-primary">
              KES {Number(minRent).toLocaleString()}
              <span className="text-xs font-normal text-fg/40">/mo</span>
            </span>
          </div>
          <span className="text-xs font-semibold text-fg/70 group-hover:text-primary transition">
            View units →
          </span>
        </div>
      </div>
    </Link>
  );
};
