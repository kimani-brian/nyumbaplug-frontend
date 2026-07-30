import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Property } from '../../types';

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
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {property.image_url && (
          <img src={property.image_url} alt={property.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute bottom-3 right-3 bg-nyumba-emerald text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
          {totalUnits} {totalUnits === 1 ? 'UNIT' : 'UNITS'}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{property.name}</h3>
        </div>

        <p className="flex items-center gap-1 text-xs text-slate-500 mb-3">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          <span className="line-clamp-1">{property.location}{property.county ? `, ${property.county}` : ''}</span>
        </p>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 flex-1">
          {property.description}
        </p>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Rent Starting From</span>
            <span className="text-base font-bold text-nyumba-emerald">KES {Number(minRent).toLocaleString()}<span className="text-xs font-normal text-slate-500">/mo</span></span>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
          >
            View Units
          </Link>
        </div>
      </div>
    </div>
  );
};
