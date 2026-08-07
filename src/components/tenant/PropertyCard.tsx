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
      className="group bg-white rounded-2xl border border-nyumba-line overflow-hidden shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col h-full hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] bg-nyumba-sand overflow-hidden">
        {property.image_url ? (
          <img
            src={optimizeImageUrl(property.image_url) ?? property.image_url}
            alt={property.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-nyumba-sand flex items-center justify-center">
            <MapPin size={28} className="text-nyumba-terracotta/40" />
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/95 text-nyumba-emerald text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
          <ShieldCheck size={11} />
          Verified Property Manager
        </div>
        <div className="absolute bottom-3 right-3 bg-nyumba-navy/85 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur">
          {totalUnits} {totalUnits === 1 ? 'UNIT' : 'UNITS'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="display font-semibold text-lg text-nyumba-ink leading-snug mb-1">
          {property.name}
        </h3>
        <p className="flex items-center gap-1 text-xs text-slate-500 mb-3">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          <span className="line-clamp-1">{property.location}{property.county ? `, ${property.county}` : ''}</span>
        </p>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{property.description}</p>

        <div className="pt-4 border-t border-nyumba-line flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Rent from</span>
            <span className="text-lg font-bold text-nyumba-emerald">
              KES {Number(minRent).toLocaleString()}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </span>
          </div>
          <span className="text-xs font-semibold text-nyumba-ink group-hover:text-nyumba-emerald transition">
            View units →
          </span>
        </div>
      </div>
    </Link>
  );
};
