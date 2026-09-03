import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
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

  const text = overHero ? 'text-white' : 'text-fg';
  const muted = overHero ? 'text-white/90' : 'text-fg/60';
  const bg = solid
    ? 'bg-page/90 backdrop-blur-xl border-b border-line'
    : 'bg-nyumba-ink/75 backdrop-blur-md border-b border-white/10';
  const dashCls = overHero
    ? 'bg-white/15 text-white hover:bg-white/25 backdrop-blur'
    : 'bg-primary text-white hover:bg-primary-dark';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLink = (to: string, children: React.ReactNode) => (
    <Link
      to={to}
      className={`text-sm font-medium ${muted} transition-colors ${
        overHero ? 'hover:text-white' : 'hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="NyumbaPlug logo"
            className="w-12 h-12 rounded-xl object-contain shadow-glow transition-transform group-hover:scale-105"
          />
          <div>
            <span className={`display font-bold text-lg leading-none tracking-tightest ${text}`}>
              Nyumba<span className="text-primary">Plug</span>
            </span>
            <span className={`block text-[9px] font-bold uppercase tracking-[0.22em] mt-0.5 ${overHero ? 'text-white/70' : 'text-fg/50'}`}>
              Find.Verify.Move
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLink('/properties', 'Units')}
          {navLink('/#trust', 'How it works')}
          {navLink('/#managers', 'Property Managers')}

          {loading ? null : user ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition ${overHero ? 'text-white/70 hover:text-white hover:bg-white/15' : 'text-fg/60 hover:text-fg hover:bg-panel-strong'}`}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="flex items-center gap-2 pl-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    overHero
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-primary text-white'
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
                  Profile
                </Link>
              )}
              {user.role === 'landlord' && (
                <Link
                  to="/account"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${
                    overHero
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'bg-page text-fg border border-line hover:bg-panel-strong'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  Profile
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={`p-2 rounded-full transition ${overHero ? 'text-white/70 hover:text-white hover:bg-white/15' : 'text-fg/60 hover:text-red-400 hover:bg-panel-strong'}`}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition ${overHero ? 'text-white/70 hover:text-white hover:bg-white/15' : 'text-fg/60 hover:text-fg hover:bg-panel-strong'}`}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link
                to="/login"
                className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                  overHero ? 'text-white hover:bg-white/15' : 'text-fg hover:bg-panel-strong'
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
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition md:hidden ${overHero ? 'text-white/70 hover:text-white hover:bg-white/15' : 'text-fg/60 hover:text-fg hover:bg-panel-strong'}`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition ${overHero ? 'text-white' : 'text-fg'}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden border-t ${overHero ? 'border-white/10 bg-nyumba-ink/95 backdrop-blur' : 'border-line bg-page/95 backdrop-blur'}`}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 space-y-1">
            {[
              { to: '/properties', label: 'Browse rentals' },
              { to: '/#trust', label: 'How it works' },
              { to: '/#managers', label: 'For property managers' },
            ].map(l => (
              <Link
                key={l.label}
                to={l.to}
                className={`block text-sm font-medium py-2.5 ${overHero ? 'text-white/80' : 'text-fg/80'}`}
              >
                {l.label}
              </Link>
            ))}

            {!loading && !user && (
              <div className="pt-3 border-t border-line space-y-2">
                <Link to="/login" className={`block text-center text-sm font-semibold py-2.5 rounded-full border ${overHero ? 'border-white/20 text-white bg-white/5 hover:bg-white/10' : 'border-line text-fg bg-panel hover:bg-panel-strong'}`}>
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
                    className="block text-center text-sm font-semibold py-2.5 rounded-full bg-primary text-white"
                  >
                    {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                )}
                {user.role === 'landlord' && (
                  <Link
                    to="/account"
                    className="block text-center text-sm font-semibold py-2.5 rounded-full bg-page text-fg border border-line"
                  >
                    Profile
                  </Link>
                )}
                {user.role === 'tenant' && (
                  <Link
                    to="/account"
                    className="block text-center text-sm font-semibold py-2.5 rounded-full bg-primary text-white"
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`block w-full text-center text-sm font-semibold py-2.5 rounded-full border ${overHero ? 'border-white/20 text-white/80' : 'border-line text-fg/80'}`}
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
