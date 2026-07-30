import React from 'react';
import { Users, User } from 'lucide-react';
import { CustomerView } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface Props {
  customers: CustomerView[];
}

export const CustomersList: React.FC<Props> = ({ customers }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Users size={18} className="text-nyumba-emerald" />
          Registered Customers
        </h3>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
          {customers.length} TOTAL
        </span>
      </div>

      {customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Customers will appear here once they register." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left p-3 font-semibold text-slate-600">Name</th>
                <th className="text-left p-3 font-semibold text-slate-600">Email</th>
                <th className="text-left p-3 font-semibold text-slate-600">Phone</th>
                <th className="text-left p-3 font-semibold text-slate-600">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-900 font-medium">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-slate-400 shrink-0" />
                      {c.full_name || '—'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{c.email || '—'}</td>
                  <td className="p-3 text-slate-600">{c.phone || '—'}</td>
                  <td className="p-3 text-slate-500">{new Date(c.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
