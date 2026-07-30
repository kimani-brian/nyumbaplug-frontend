import React from 'react';
import { UnitStatus } from '../../types';

interface Props {
  status: UnitStatus;
}

export const UnitStatusBadge: React.FC<Props> = ({ status }) => {
  const styles: Record<UnitStatus, { bg: string; text: string; label: string }> = {
    vacant: { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-800 font-bold', label: 'VACANT' },
    occupied: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-600', label: 'Occupied' },
    reserved: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-800', label: 'Reserved' },
    maintenance: { bg: 'bg-red-100 border-red-300', text: 'text-red-800', label: 'Maintenance' },
  };

  const style = styles[status] || styles.occupied;

  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs rounded border uppercase tracking-wider ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};