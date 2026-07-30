import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { api } from '../../services/api';
import { Search, MapPin, ShieldCheck } from 'lucide-react';

const PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: 'KES 4,000 – 10,000', min: 4000, max: 10000 },
  { label: 'KES 11,000 – 20,000', min: 11000, max: 20000 },
  { label: 'KES 21,000 – 50,000', min: 21000, max: 50000 },
  { label: 'KES 51,000 – 100,000', min: 51000, max: 100000 },
  { label: 'KES 101,000 – 1,000,000', min: 101000, max: 1000000 },
];

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
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
        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
          <ShieldCheck size={11} />
          Verified Agent
        </div>
        <div className="absolute bottom-2 right-2 bg-nyumba-emerald text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
          {totalUnits} {totalUnits === 1 ? 'UNIT' : 'UNITS'}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-lg line-clamp-1 mb-1">{property.name}</h3>
        <p className="flex items-center gap-1 text-xs text-slate-500 mb-3">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          <span className="line-clamp-1">{property.location}{property.county ? `, ${property.county}` : ''}</span>
        </p>
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 flex-1">{property.description}</p>
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

export const BrowsePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [query, setQuery] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchProperties = async (priceOverride?: { min?: number; max?: number }) => {
    setLoading(true);
    try {
      const price = priceOverride ?? (selectedPrice
        ? PRICE_RANGES.find(r => r.label === selectedPrice) ?? {}
        : {});
      const res = await api.getProperties({
        q: query || undefined,
        min_rent: price.min,
        max_rent: price.max,
      });
      setProperties(res);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  return (
    <div className="min-h-screen bg-nyumba-cream">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by location, estate, county, unit type&hellip;"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={() => fetchProperties()}
              className="bg-nyumba-emerald hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition flex items-center justify-center gap-2 shrink-0"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedPrice(''); fetchProperties({}); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  selectedPrice === ''
                    ? 'bg-nyumba-emerald text-white border-nyumba-emerald'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Any Price
              </button>
              {PRICE_RANGES.map(r => (
                <button
                  key={r.label}
                  onClick={() => { setSelectedPrice(r.label); fetchProperties({ min: r.min, max: r.max }); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    selectedPrice === r.label
                      ? 'bg-nyumba-emerald text-white border-nyumba-emerald'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {loading ? 'Loading...' : `Available Listings (${properties.length})`}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white h-80 rounded-xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 font-medium">No properties found matching your search.</p>
            <p className="text-xs text-slate-300 mt-1">Try different search terms or price range.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
