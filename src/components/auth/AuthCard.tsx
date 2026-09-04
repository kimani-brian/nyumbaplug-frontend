import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Shared Google-style auth shell (Login / Register / Verify).
 * Centered white-surface card on the page background with a subtle
 * blue halo, brand mark, title/subtitle and a bottom footer row.
 */
export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* subtle blue decor, hidden on small screens to avoid overflow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10rem] w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl hidden sm:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-[-10rem] w-[24rem] h-[24rem] rounded-full bg-primary/5 blur-3xl hidden sm:block"
      />

      <div className="relative w-full max-w-md">
        <div className="bg-panel border border-line rounded-2xl shadow-lift p-6 sm:p-10">
          <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
            <img
              src={logo}
              alt="NyumbaPlug logo"
              className="w-11 h-11 rounded-xl object-contain shadow-glow"
            />
            <div>
              <span className="display font-bold text-lg leading-none tracking-tightest text-fg">
                Nyumba<span className="text-primary">Plug</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.22em] mt-0.5 text-fg/50">
                Verified Kenya Rentals
              </span>
            </div>
          </Link>

          <h1 className="display text-[1.75rem] leading-tight font-medium text-fg text-center tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-fg/60 mt-2 mb-8 text-center">{subtitle}</p>}

          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-fg/60">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthCard;