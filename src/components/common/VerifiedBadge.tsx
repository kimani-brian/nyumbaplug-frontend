import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  verifiedAt?: string;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'md', verifiedAt, className = '' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = { sm: 14, md: 16, lg: 20 };

  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div
      className={`inline-flex items-center rounded-full bg-nyumba-emeraldLight text-nyumba-emerald border border-nyumba-emerald/30 font-medium ${sizeClasses[size]} ${className}`}
      title="Verified by NyumbaPlug Admin Team via Government ID & Title Deeds"
    >
      <ShieldCheck size={iconSizes[size]} className="fill-nyumba-emerald text-white shrink-0" />
      <span>Verified Landlord</span>
      {formattedDate && <span className="opacity-75 font-normal text-[0.85em]">since {formattedDate}</span>}
    </div>
  );
};