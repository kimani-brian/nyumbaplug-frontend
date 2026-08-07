import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Property } from '../../types';
import { api } from '../../services/api';

export const PropertyManagerPropertiesPage: React.FC = () => {
  const { landlordId } = useParams<{ landlordId: string }>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (landlordId) {
      api.getPropertyManagerProperties(landlordId)
        .then(setProperties)
        .catch(() => setProperties([]))
        .finally(() => setLoading(false));
    }
  }, [landlordId]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Admin Console
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Property Manager Properties</h1>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400">Loading...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">
          This property manager has no properties listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {p.image_url && (
                <div className="aspect-[16/9] bg-slate-100">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-slate-900">{p.name}</h3>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  {p.location}{p.county ? `, ${p.county}` : ''}
                </p>
                {p.description && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{p.description}</p>
                )}
                {p.categories && p.categories.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {p.categories.map(c => (
                      <div key={c.id} className="flex items-center justify-between text-xs bg-slate-50 rounded px-2 py-1">
                        <span className="text-slate-600">{c.name}</span>
                        <span className="font-semibold text-nyumba-emerald">KES {Number(c.rent_amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
