import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-nyumba-emerald p-1 rounded-lg text-white">
                <Shield size={18} className="fill-white" />
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900">Nyumba<span className="text-nyumba-emerald">Plug</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified Kenya Rentals — every listing is linked to a government ID-verified agent.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Browse</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-xs text-slate-400 hover:text-nyumba-emerald transition">All Properties</Link></li>
              <li><Link to="/" className="text-xs text-slate-400 hover:text-nyumba-emerald transition">1 Bedroom</Link></li>
              <li><Link to="/" className="text-xs text-slate-400 hover:text-nyumba-emerald transition">2 Bedrooms</Link></li>
              <li><Link to="/" className="text-xs text-slate-400 hover:text-nyumba-emerald transition">3 Bedrooms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-xs text-slate-400 hover:text-nyumba-emerald transition">Sign In</Link></li>
              <li><Link to="/register" className="text-xs text-slate-400 hover:text-nyumba-emerald transition">Register as Customer</Link></li>
              <li><Link to="/register" className="text-xs text-slate-400 hover:text-nyumba-emerald transition">Register as Agent</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Trust & Safety</h4>
            <ul className="space-y-2">
              <li><span className="text-xs text-slate-400">Verification Process</span></li>
              <li><span className="text-xs text-slate-400">Scam Reporting</span></li>
              <li><span className="text-xs text-slate-400">Privacy Policy</span></li>
              <li><span className="text-xs text-slate-400">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} NyumbaPlug. All rights reserved.</p>
          <p className="text-xs text-slate-400">Built for the Kenyan rental market.</p>
        </div>
      </div>
    </footer>
  );
};
