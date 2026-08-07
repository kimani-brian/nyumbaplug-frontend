import React from 'react';
import { Users, User, Eye } from 'lucide-react';
import { CustomerView } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  customers: CustomerView[];
  onViewProfile?: (customerId: string) => void;
}

export const CustomersList: React.FC<Props> = ({ customers, onViewProfile }) => {
  return (
    <div className="bg-white rounded-2xl border border-nyumba-line shadow-soft overflow-hidden">
      <div className="p-5 bg-nyumba-navy text-white flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Users size={18} className="text-nyumba-emerald" />
          Registered Customers
        </h3>
        <span className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full font-mono">
          {customers.length} TOTAL
        </span>
      </div>

      {customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Customers will appear here once they register." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-nyumba-line bg-nyumba-cream">
                <th className="text-left p-3 font-semibold text-slate-600">Name</th>
                <th className="text-left p-3 font-semibold text-slate-600">Email</th>
                <th className="text-left p-3 font-semibold text-slate-600">Phone</th>
                <th className="text-left p-3 font-semibold text-slate-600">Location</th>
                <th className="text-left p-3 font-semibold text-slate-600">Registered</th>
                {onViewProfile && <th className="text-left p-3 font-semibold text-slate-600">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-nyumba-line">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-nyumba-cream/60 transition">
                  <td className="p-3 text-slate-900 font-medium">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-slate-400 shrink-0" />
                      {c.full_name || '—'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{c.email || '—'}</td>
                  <td className="p-3 text-slate-600">{c.phone || '—'}</td>
                  <td className="p-3 text-slate-600">{c.location || '—'}</td>
                  <td className="p-3 text-slate-500">{new Date(c.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  {onViewProfile && (
                    <td className="p-3">
                      <button
                        onClick={() => onViewProfile(c.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-nyumba-emerald hover:text-emerald-700 transition"
                      >
                        <Eye size={14} /> Profile
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
