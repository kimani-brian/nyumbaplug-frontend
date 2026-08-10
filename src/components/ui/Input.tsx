import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export const Input: React.FC<InputProps> = ({ label, error, className, id, ...rest }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-fg/80 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={clsx('w-full px-4 py-3 border border-line rounded-xl bg-panel text-fg placeholder:text-fg/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition', className)}
        {...rest}
      />
      {error && (
        <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg mt-2">
          {error}
        </p>
      )}
    </div>
  );
};
