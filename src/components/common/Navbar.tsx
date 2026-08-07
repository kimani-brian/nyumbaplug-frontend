import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleLabel = (role: string) => {
  if (role === 'admin') return 'Admin';
  if (role === 'landlord') return 'Property Manager';
  return 'Customer';
};

export const Navbar: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const overHero = isHome && !scrolled;
  const solid = !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const text = overHero ? 'text-white' : 'text-nyumba-ink';
  const muted = overHero ? 'text-white/70' : 'text-slate-500';
  const bg = solid ? 'bg-nyumba-cream/95 backdrop-blur border-b border-nyumba-line shadow-sm' : 'bg-transparent border-b border-transparent';
  const dashCls = overHero
    ? 'bg-white/15 text-white hover:bg-white/25'
    : 'bg-nyumba-emerald text-white hover:bg-nyumba-emeraldDark';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLink = (to: string, children: React.ReactNode) => (
    <Link
      to={to}
      className={`text-sm font-medium ${muted} transition ${
        overHero ? 'hover:text-white' : 'hover:text-nyumba-emerald'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-nyumba-emerald p-2 rounded-xl text-white shadow-soft">
            <Shield size={20} className="fill-white" />
          </div>
          <div>
            <span className={`display font-bold text-lg leading-none tracking-tightest ${text}`}>
              Nyumba<span className="text-nyumba-emerald">Plug</span>
            </span>
            <span className={`block text-[9px] font-bold uppercase tracking-[0.22em] mt-0.5 ${overHero ? 'text-white/70' : 'text-nyumba-terracotta'}`}>
              Verified Kenya Rentals
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLink('/properties', 'Browse rentals')}
          {navLink('/#trust', 'How it works')}
          {navLink('/#managers', 'For property managers')}

          {loading ? null : user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 pl-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    overHero
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-nyumba-emerald text-white'
                  }`}
                  title={user.email || 'User'}
                >
                  {(user.email || user.phone || '?').charAt(0).toUpperCase()}
                </div>
                <span className={`text-xs font-semibold ${muted}`}>
                  {user.email?.split('@')[0] || roleLabel(user.role)}
                </span>
              </div>
              {user.role !== 'tenant' && (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/landlord'}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${dashCls}`}
                >
                  <LayoutDashboard size={14} />
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
              )}
              {user.role === 'tenant' && (
                <Link
                  to="/account"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${dashCls}`}
                >
                  <LayoutDashboard size={14} />
                  My Account
                </Link>
              )}
              {user.role === 'landlord' && (
                <Link
                  to="/account"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${
                    overHero
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'bg-nyumba-navy text-white hover:bg-nyumba-navy/90'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  My Account
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={`p-2 rounded-full transition ${overHero ? 'text-white/70 hover:text-white hover:bg-white/15' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'}`}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                  overHero ? 'text-white hover:bg-white/15' : 'text-nyumba-ink hover:bg-nyumba-sand'
                }`}
              >
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5">
                Get started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-lg transition ${overHero ? 'text-white' : 'text-nyumba-ink'}`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden border-t ${overHero ? 'border-white/10 bg-nyumba-navy/95 backdrop-blur' : 'border-nyumba-line bg-nyumba-cream'}`}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 space-y-1">
            {[
              { to: '/properties', label: 'Browse rentals' },
              { to: '/#trust', label: 'How it works' },
              { to: '/#managers', label: 'For property managers' },
            ].map(l => (
              <Link
                key={l.label}
                to={l.to}
                className={`block text-sm font-medium py-2.5 ${overHero ? 'text-white/80' : 'text-slate-600'}`}
              >
                {l.label}
              </Link>
            ))}

            {!loading && !user && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <Link to="/login" className="block text-center text-sm font-semibold py-2.5 rounded-full border border-nyumba-line text-nyumba-ink bg-white">
                  Sign in
                </Link>
                <Link to="/register" className="block text-center btn-primary w-full">
                  Get started
                </Link>
              </div>
            )}
            {!loading && user && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                {user.role !== 'tenant' && (
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/landlord'}
                    className="block text-center text-sm font-semibold py-2.5 rounded-full bg-nyumba-emerald text-white"
                  >
                    {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                )}
                {user.role === 'landlord' && (
                  <Link
                    to="/account"
                    className="block text-center text-sm font-semibold py-2.5 rounded-full bg-nyumba-navy text-white"
                  >
                    My Account
                  </Link>
                )}
                {user.role === 'tenant' && (
                  <Link
                    to="/account"
                    className="block text-center text-sm font-semibold py-2.5 rounded-full bg-nyumba-emerald text-white"
                  >
                    My Account
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center text-sm font-semibold py-2.5 rounded-full border border-nyumba-line text-slate-600"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
