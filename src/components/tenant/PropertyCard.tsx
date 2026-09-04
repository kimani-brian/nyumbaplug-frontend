import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { optimizeImageUrl, resolveMediaUrl } from '../../utils/image';
import { MapPinIcon, ArrowForward } from '../../utils/icons';

interface Props {
  property: Property;
}

export const PropertyCard: React.FC<Props> = ({ property }) => {
  const categories = property.categories || [];
  const minRent = property.min_rent ??
    (categories.length > 0 ? Math.min(...categories.map(c => Number(c.rent_amount))) : 0);

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group bg-panel border border-line rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] bg-panel-strong overflow-hidden">
        {property.image_url ? (
          <img
            src={optimizeImageUrl(resolveMediaUrl(property.image_url)) ?? property.image_url}
            alt={property.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-panel-strong flex items-center justify-center">
            <MapPinIcon size={28} className="text-fg/20" />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="display font-bold text-lg text-fg leading-snug mb-1">
          {property.name}
        </h3>
        <p className="flex items-center gap-1 text-xs text-fg/50 mb-3">
          <MapPinIcon size={14} className="text-fg/40 shrink-0" />
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
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-fg/70 group-hover:text-primary transition">
            View units
            <ArrowForward size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
};
