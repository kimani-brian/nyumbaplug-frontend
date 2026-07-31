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
  light = false,
}) => {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {kicker && (
        <p
          className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${
            light ? 'text-nyumba-emerald' : 'text-nyumba-terracotta'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`display text-3xl sm:text-4xl leading-[1.1] ${
          light ? 'text-white' : 'text-nyumba-ink'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-sm sm:text-base leading-relaxed ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          {description}
        </p>
      )}
    </div>
  );
};
