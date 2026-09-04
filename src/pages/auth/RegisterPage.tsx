import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import logo from '../../assets/logo.png';

type RegisterRole = 'customer' | 'manager';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<RegisterRole>('customer');
  const [fullName, setFullName] = useState('');
  const [pageName, setPageName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const mappedRole = role === 'manager' ? 'landlord' : 'tenant';
      const res = await register(email, password, mappedRole, fullName || undefined, pageName || undefined);
      navigate('/verify', { state: { email: res.email }, replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const roles = [
    {
      key: 'customer' as RegisterRole,
      label: 'Customer',
      icon: <Icon name="home" size={18} />,
      blurb: 'Find your verified rental',
    },
    {
      key: 'manager' as RegisterRole,
      label: 'Property Manager',
      icon: <Icon name="apartment" size={18} />,
      blurb: 'List your properties',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-5 sm:px-10 py-16">
      <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <img
              src={logo}
              alt="NyumbaPlug logo"
              className="w-12 h-12 rounded-xl object-contain shadow-glow"
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

          <h1 className="display font-bold text-3xl text-fg leading-tight">Join NyumbaPlug</h1>
          <p className="text-sm text-fg/60 mt-2 mb-8">Create your account in under a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-fg/80 mb-1.5">I want to…</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    aria-pressed={role === r.key}
                    className={`flex flex-col items-start gap-1 text-left p-3.5 rounded-xl border transition ${
                      role === r.key
                        ? 'bg-primary text-white border-primary shadow-glow'
                        : 'bg-panel text-fg/80 border-line hover:border-primary'
                    }`}
                  >
                    <span className={`${role === r.key ? 'text-white' : 'text-primary'}`}>{r.icon}</span>
                    <span className="text-sm font-bold">{r.label}</span>
                    <span className={`text-[10px] ${role === r.key ? 'text-white/80' : 'text-fg/50'}`}>
                      {r.blurb}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {role === 'customer' && (
              <div>
                <label className="block text-xs font-semibold text-fg/80 mb-1.5">Full Name *</label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  aria-label="Full name"
                />
              </div>
            )}

            {role === 'manager' && (
              <div>
                <label className="block text-xs font-semibold text-fg/80 mb-1.5">Page Name *</label>
                <Input
                  id="pageName"
                  type="text"
                  required
                  placeholder="e.g. Greenleaf Properties"
                  value={pageName}
                  onChange={e => setPageName(e.target.value)}
                  aria-label="Page name"
                />
                <p className="text-[11px] text-fg/50 mt-1.5">
                  This is the public name shown on your listings page.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-fg/80 mb-1.5">Email *</label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg/80 mb-1.5">Password *</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  aria-label="Password"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg/40 hover:text-fg/70"
                  aria-label="Toggle password visibility"
                  aria-pressed={showPwd}
                >
                  {showPwd ? <Icon name="visibility_off" size={16} /> : <Icon name="visibility" size={16} />}
                </button>
              </div>
            </div>

            {role === 'manager' && (
              <p className="flex items-start gap-1.5 text-[11px] text-white/60 bg-primary/10 border border-primary/30 p-2.5 rounded-lg">
                <Icon name="verified" size={14} className="text-primary shrink-0 mt-0.5" />
                After registering, you'll submit your national ID for verification before you can list properties.
              </p>
            )}

            {error && <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary !py-3 disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create account & verify'}
            </button>
          </form>

<p className="text-xs text-fg/50 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="inline-flex items-center gap-0.5 text-primary font-semibold hover:underline">
              Sign in
              <Icon name="arrow_forward" size={12} />
            </Link>
          </p>
        </div>
    </div>
  );
};


