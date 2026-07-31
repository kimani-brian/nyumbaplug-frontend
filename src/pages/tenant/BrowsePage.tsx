import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShieldCheck, RotateCcw } from 'lucide-react';
import { Property } from '../../types';
import { api } from '../../services/api';
import { PropertyCard } from '../../components/tenant/PropertyCard';
import { SectionHeading } from '../../components/common/SectionHeading';

const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: 'Any price' },
  { label: 'KES 4K – 10K', min: 4000, max: 10000 },
  { label: 'KES 11K – 20K', min: 11000, max: 20000 },
  { label: 'KES 21K – 50K', min: 21000, max: 50000 },
  { label: 'KES 51K – 100K', min: 51000, max: 100000 },
  { label: 'KES 101K – 1M', min: 101000, max: 1000000 },
];

export const BrowsePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialCounty = searchParams.get('county') || '';

  const [query, setQuery] = useState(initialQ);
  const [county, setCounty] = useState(initialCounty);
  const [priceLabel, setPriceLabel] = useState<string>('Any price');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = (overrides?: { q?: string; county?: string; min?: number; max?: number }) => {
    setLoading(true);
    const q = overrides?.q !== undefined ? overrides.q : query;
    const c = overrides?.county !== undefined ? overrides.county : county;
    const hasPrice = overrides && (overrides.min !== undefined || overrides.max !== undefined);

    api
      .getProperties({
        q: q || undefined,
        county: c || undefined,
        min_rent: hasPrice ? overrides!.min : undefined,
        max_rent: hasPrice ? overrides!.max : undefined,
      })
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties({ q: initialQ, county: initialCounty });
  }, []);

  const applySearch = () => {
    const next: Record<string, string> = {};
    if (query.trim()) next.q = query.trim();
    if (county.trim()) next.county = county.trim();
    setSearchParams(next, { replace: true });
    fetchProperties();
  };

  const pickPrice = (r: { label: string; min?: number; max?: number }) => {
    setPriceLabel(r.label);
    fetchProperties({ min: r.min, max: r.max });
  };

  const resetAll = () => {
    setQuery('');
    setCounty('');
    setPriceLabel('Any price');
    setSearchParams({}, { replace: true });
    fetchProperties({ q: '', county: '' });
  };

  const heading = county
    ? `Verified rentals in ${county}`
    : query
      ? `Results for "${query}"`
      : 'Browse verified rentals';

  return (
    <div className="min-h-screen bg-nyumba-cream">
      {/* Header */}
      <div className="bg-white border-b border-nyumba-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-10">
          <SectionHeading
            kicker="Search"
            title={heading}
            description="Every listing below is linked to a government ID-verified agent. Contact is only shown for vacant, verified units."
          />

          {/* Search row */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-3xl">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-nyumba-cream rounded-full border border-nyumba-line focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/20">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by estate, location, county, unit type…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applySearch()}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <button onClick={applySearch} className="btn-primary">
              <Search size={16} />
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mr-1">
              Price
            </span>
            {PRICE_RANGES.map(r => (
              <button
                key={r.label}
                onClick={() => pickPrice(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  priceLabel === r.label
                    ? 'bg-nyumba-emerald text-white border-nyumba-emerald'
                    : 'bg-white text-slate-600 border-nyumba-line hover:border-nyumba-emerald'
                }`}
              >
                {r.label}
              </button>
            ))}

            <span className="mx-1 hidden sm:inline text-slate-300">|</span>

            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-nyumba-emerald border border-transparent hover:border-nyumba-line transition"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {loading ? 'Loading…' : (
              <>
                <span className="font-bold text-nyumba-ink">{properties.length}</span>{' '}
                {properties.length === 1 ? 'verified listing' : 'verified listings'}
              </>
            )}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-nyumba-emerald font-semibold">
            <ShieldCheck size={13} />
            All listings verified
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white h-[360px] rounded-2xl animate-pulse border border-nyumba-line" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-nyumba-line">
            <div className="bg-nyumba-sand w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={22} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-semibold text-sm">No verified listings found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try different search terms, a broader price range, or clear your filters.
            </p>
            <button onClick={resetAll} className="btn-outline mt-6 !py-2.5">
              <RotateCcw size={14} />
              Clear all filters
            </button>
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
