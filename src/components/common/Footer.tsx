import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-nyumba-line bg-nyumba-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-nyumba-emerald p-1.5 rounded-lg text-white">
                <Shield size={16} className="fill-white" />
              </div>
              <span className="display font-bold tracking-tightest text-nyumba-ink">Nyumba<span className="text-nyumba-emerald">Plug</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
              Verified Kenya Rentals — every listing is linked to a government ID-verified agent.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Browse</h4>
            <ul className="space-y-2">
              <li><Link to="/properties" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">All Properties</Link></li>
              <li><Link to="/properties" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">Featured Listings</Link></li>
              <li><Link to="/properties?county=Nairobi" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">Nairobi</Link></li>
              <li><Link to="/properties?county=Mombasa" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">Mombasa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">Sign In</Link></li>
              <li><Link to="/register" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">Register as Customer</Link></li>
              <li><Link to="/register" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">Register as Agent</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Trust & Safety</h4>
            <ul className="space-y-2">
              <li><Link to="/#trust" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">How Verification Works</Link></li>
              <li><Link to="/#trust" className="text-xs text-slate-500 hover:text-nyumba-emerald transition">Scam Reporting</Link></li>
              <li><span className="text-xs text-slate-500">Privacy Policy</span></li>
              <li><span className="text-xs text-slate-500">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-nyumba-line mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} NyumbaPlug. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built for the Kenyan rental market.</p>
        </div>
      </div>
    </footer>
  );
};
