import React from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className, children, ...rest }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition';
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const variants: Record<Variant, string> = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'bg-transparent'
  };

  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
};
