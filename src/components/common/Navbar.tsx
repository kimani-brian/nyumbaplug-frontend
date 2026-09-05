import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  MenuIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  LogoutIcon,
} from '../../utils/icons';
import logo from '../../assets/logo.png';

const roleLabel = (role: string) => {
  if (role === 'admin') return 'Admin';
  if (role === 'landlord') return 'Property Manager';
  return 'Customer';
};

export const Navbar: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const solid = scrolled || location.pathname !== '/';
  const text = 'text-fg';
  const muted = 'text-fg/60';
  const bg = `bg-page/90 backdrop-blur-xl ${solid ? 'shadow-soft border-b border-line' : 'border-b border-transparent'}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLink = (to: string, children: React.ReactNode) => (
    <Link
      to={to}
      className={`text-sm font-medium ${muted} transition-colors hover:text-primary`}
    >
      {children}
    </Link>
  );

  const themeBtn = (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition text-fg/60 hover:text-fg hover:bg-panel-strong"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="NyumbaPlug logo"
            className="w-12 h-12 rounded-xl object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <span className={`display font-bold text-lg leading-none tracking-tightest ${text}`}>
              Nyumba<span className="text-primary">Plug</span>
            </span>
            <span className={`block text-[9px] font-bold uppercase tracking-[0.22em] mt-0.5 ${muted}`}>
              Find.Verify.Move
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLink('/properties', 'Units')}
          {navLink('/#how-it-works', 'How it works')}
          {navLink('/#managers', 'Property Managers')}

          {loading ? null : user ? (
            <div className="flex items-center gap-2.5">
              {themeBtn}
              <span className="text-sm font-medium text-fg/80">{roleLabel(user.role)}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-line text-fg/70 hover:text-fg hover:bg-panel-strong transition"
              >
                <LogoutIcon size={16} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {themeBtn}
              <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full text-fg/80 hover:text-primary transition"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition shadow-glow"
              >
                Get started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile icon row */}
        <div className="md:hidden flex items-center gap-1.5">
          {themeBtn}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg transition text-fg"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-line bg-page/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 space-y-1">
            {[
              { to: '/properties', label: 'Browse rentals' },
              { to: '/#how-it-works', label: 'How it works' },
              { to: '/#managers', label: 'For property managers' },
            ].map(l => (
              <Link
                key={l.label}
                to={l.to}
                className="block text-sm font-medium py-2.5 text-fg/80"
              >
                {l.label}
              </Link>
            ))}

            {!loading && !user && (
              <div className="pt-3 border-t border-line space-y-2">
                <Link
                  to="/login"
                  className="block text-center text-sm font-semibold py-2.5 rounded-lg border border-line text-fg bg-panel hover:bg-panel-strong"
                >
                  Sign in
                </Link>
                <Link to="/register" className="block text-center btn-primary w-full">
                  Get started
                </Link>
              </div>
            )}
            {!loading && user && (
              <div className="pt-3 border-t border-line space-y-2">
                {user.role !== 'tenant' && (
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/landlord'}
                    className="block text-center text-sm font-semibold py-2.5 rounded-lg bg-primary text-white"
                  >
                    {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                )}
                {user.role === 'landlord' && (
                  <Link
                    to="/account"
                    className="block text-center text-sm font-semibold py-2.5 rounded-lg bg-page text-fg border border-line"
                  >
                    Profile
                  </Link>
                )}
                {user.role === 'tenant' && (
                  <Link
                    to="/account"
                    className="block text-center text-sm font-semibold py-2.5 rounded-lg bg-primary text-white"
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center text-sm font-semibold py-2.5 rounded-lg border border-line text-fg/80"
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
