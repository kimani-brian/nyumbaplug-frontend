import React from 'react';
import { UnitStatus } from '../../types';

interface Props {
  status: UnitStatus;
}

export const UnitStatusBadge: React.FC<Props> = ({ status }) => {
  const styles: Record<UnitStatus, { bg: string; text: string; label: string }> = {
    vacant: { bg: 'bg-primary text-white border-primary/30', text: 'font-bold', label: 'VACANT' },
    occupied: { bg: 'bg-panel-strong border-line', text: 'text-fg/70', label: 'Occupied' },
    reserved: { bg: 'bg-amber-500/20 border-amber-500/30', text: 'text-amber-400', label: 'Reserved' },
    maintenance: { bg: 'bg-red-500/20 border-red-500/30', text: 'text-red-400', label: 'Maintenance' },
  };

  const style = styles[status] || styles.occupied;

  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs rounded-full border uppercase tracking-wider ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};
