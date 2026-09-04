import React from 'react';
import { UsersIcon, UserIcon, EyeIcon } from '../../utils/icons';
import { CustomerView } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  customers: CustomerView[];
  onViewProfile?: (customerId: string) => void;
}

export const CustomersList: React.FC<Props> = ({ customers, onViewProfile }) => {
  return (
    <div className="bg-panel rounded-2xl border border-line shadow-soft overflow-hidden">
      <div className="p-5 bg-panel border-b border-line text-fg flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <UsersIcon size={18} className="text-primary" />
          Registered Customers
        </h3>
        <span className="text-xs bg-panel-strong text-fg/70 px-2.5 py-1 rounded-full font-mono">
          {customers.length} TOTAL
        </span>
      </div>

      {customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Customers will appear here once they register." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-line bg-panel">
                <th className="text-left p-3 font-semibold text-fg/60">Name</th>
                <th className="text-left p-3 font-semibold text-fg/60">Email</th>
                <th className="text-left p-3 font-semibold text-fg/60">Phone</th>
                <th className="text-left p-3 font-semibold text-fg/60">Location</th>
                <th className="text-left p-3 font-semibold text-fg/60">Registered</th>
                {onViewProfile && <th className="text-left p-3 font-semibold text-fg/60">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-panel-strong transition">
                  <td className="p-3 text-fg font-medium">
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={14} className="text-fg/40 shrink-0" />
                      {c.full_name || '—'}
                    </span>
                  </td>
                  <td className="p-3 text-fg/60">{c.email || '—'}</td>
                  <td className="p-3 text-fg/60">{c.phone || '—'}</td>
                  <td className="p-3 text-fg/60">{c.location || '—'}</td>
                  <td className="p-3 text-fg/50">{new Date(c.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  {onViewProfile && (
                    <td className="p-3">
                      <button
                        onClick={() => onViewProfile(c.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary transition"
                      >
                        <EyeIcon size={14} /> Profile
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
