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
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={clsx('w-full px-3.5 py-3 border border-nyumba-line rounded-xl bg-white focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition', className)}
        {...rest}
      />
      {error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg mt-2">
          {error}
        </p>
      )}
    </div>
  );
};
