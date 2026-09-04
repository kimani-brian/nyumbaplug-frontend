import React from 'react';
import { InboxIcon } from '../../utils/icons';

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-fg/30 mb-3">
        {icon || <InboxIcon size={48} />}
      </div>
      <h3 className="text-sm font-semibold text-fg/70">{title}</h3>
      {description && <p className="text-xs text-fg/40 mt-1 max-w-xs">{description}</p>}
    </div>
  );
};
