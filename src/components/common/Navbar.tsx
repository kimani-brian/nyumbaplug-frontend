import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleLabel = (role: string) => {
  if (role === 'admin') return 'Admin';
  if (role === 'landlord') return 'Agent';
  return 'Customer';
};

export const Navbar: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-nyumba-emerald p-1.5 rounded-lg text-white">
            <Shield size={22} className="fill-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900">Nyumba<span className="text-nyumba-emerald">Plug</span></span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-nyumba-emerald -mt-1">Verified Kenya Rentals</span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-mono font-medium">
                {user.email || 'User'} ({roleLabel(user.role)})
              </span>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-xs bg-nyumba-navy text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition"
                >
                  Admin Panel
                </Link>
              )}
              {user.role === 'landlord' && (
                <Link
                  to="/landlord"
                  className="text-xs bg-nyumba-emerald text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition"
                >
                  Agent Dashboard
                </Link>
              )}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-nyumba-emerald hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
