import React from 'react';
import { MapPin, Filter } from 'lucide-react';

interface Props {
  location: string;
  onLocationChange: (val: string) => void;
  unitType: string;
  onUnitTypeChange: (val: string) => void;
  bedrooms: number;
  onBedroomsChange: (val: number) => void;
  onSearch: () => void;
}

export const PropertySearchFilter: React.FC<Props> = ({
  location, onLocationChange,
  unitType, onUnitTypeChange,
  bedrooms, onBedroomsChange,
  onSearch,
}) => {
  return (
    <div className="bg-white p-3 rounded-xl shadow-2xl text-slate-900 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-2 mt-6">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
        <MapPin size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Estate (e.g. Kilimani)"
          value={location}
          onChange={e => onLocationChange(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
        <Filter size={18} className="text-slate-400 shrink-0" />
        <select
          value={unitType}
          onChange={e => onUnitTypeChange(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="studio">Studio</option>
          <option value="1br">1 Bedroom</option>
          <option value="2br">2 Bedrooms</option>
          <option value="3br">3 Bedrooms</option>
        </select>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
        <Filter size={18} className="text-slate-400 shrink-0" />
        <select
          value={bedrooms}
          onChange={e => onBedroomsChange(Number(e.target.value))}
          className="w-full bg-transparent text-sm focus:outline-none"
        >
          <option value={0}>Any Bedrooms</option>
          <option value={1}>1 Bedroom</option>
          <option value={2}>2 Bedrooms</option>
          <option value={3}>3 Bedrooms</option>
        </select>
      </div>

      <button
        onClick={onSearch}
        className="bg-nyumba-emerald hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition"
      >
        Search
      </button>
    </div>
  );
};


