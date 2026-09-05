import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon } from '../../utils/icons';
import logo from '../../assets/logo.png';

const linkCls = 'text-xs text-fg/60 hover:text-fg transition-colors';
const headingCls = 'text-xs font-bold text-fg uppercase tracking-wider mb-3';

const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-page text-fg border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img
                src={logo}
                alt="NyumbaPlug logo"
                className="w-11 h-11 rounded-lg object-contain"
              />

              <div className="flex flex-col">
                <span className="display font-bold tracking-tightest text-fg">
                  Nyumba<span className="text-primary">Plug</span>
                </span>

                <p className="text-xs text-fg/50 leading-relaxed tracking-wider">
                  Find.Verify.Move.
                </p>
              </div>
            </div>

            <p className="text-xs text-fg/50 leading-relaxed max-w-[220px]">
              Every listing is managed by a verified property manager.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.instagram.com/nyumbahub254"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NyumbaPlug on Instagram"
                className="w-9 h-9 rounded-full bg-panel border border-line flex items-center justify-center text-fg/60 hover:text-primary hover:border-primary/40 transition-colors"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@nyumbahub254"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NyumbaPlug on TikTok"
                className="w-9 h-9 rounded-full bg-panel border border-line flex items-center justify-center text-fg/60 hover:text-primary hover:border-primary/40 transition-colors"
              >
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className={headingCls}>Browse</h4>
            <ul className="space-y-2">
              <li><Link to="/properties" className={linkCls}>All Properties</Link></li>
              <li><Link to="/properties" className={linkCls}>Featured Listings</Link></li>
              <li><Link to="/properties?county=Nairobi" className={linkCls}>Nairobi</Link></li>
              <li><Link to="/properties?county=Mombasa" className={linkCls}>Mombasa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={headingCls}>Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className={linkCls}>Sign In</Link></li>
              <li><Link to="/register" className={linkCls}>Register as Customer</Link></li>
              <li><Link to="/register" className={linkCls}>Register as Property Manager</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={headingCls}>Trust & Safety</h4>
            <ul className="space-y-2">
              <li><Link to="/#trust" className={linkCls}>How Verification Works</Link></li>
              <li><Link to="/#trust" className={linkCls}>Scam Reporting</Link></li>
              <li><span className="text-xs text-fg/40">Privacy Policy</span></li>
              <li><span className="text-xs text-fg/40">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-fg/40">&copy; {new Date().getFullYear()} NyumbaPlug. All rights reserved.</p>
          <p className="text-xs text-fg/40">Built for the Kenyan rental market.</p>
        </div>
      </div>
    </footer>
  );
};
