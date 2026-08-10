import React from 'react';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export const SectionHeading: React.FC<Props> = ({
  kicker,
  title,
  description,
  align = 'left',
  light = true,
}) => {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {kicker && (
        <p
          className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${
            light ? 'text-primary' : 'text-primary-dark'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold ${
          light ? 'text-fg' : 'text-fg'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-sm sm:text-base leading-relaxed ${light ? 'text-fg/60' : 'text-fg/60'}`}>
          {description}
        </p>
      )}
    </div>
  );
};
