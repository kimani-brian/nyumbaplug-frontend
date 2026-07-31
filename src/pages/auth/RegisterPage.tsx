import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight, Building2, BadgeCheck, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type RegisterRole = 'customer' | 'agent';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<RegisterRole>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const mappedRole = role === 'agent' ? 'landlord' : 'tenant';
      await register(email, password, mappedRole, fullName || undefined);
      if (mappedRole === 'landlord') {
        navigate('/landlord');
      } else {
        navigate('/');
      }
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
      icon: <Home size={18} />,
      blurb: 'Find your verified rental',
    },
    {
      key: 'agent' as RegisterRole,
      label: 'Agent',
      icon: <Building2 size={18} />,
      blurb: 'List your properties',
    },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-nyumba-cream">
      {/* Left — form */}
      <div className="flex items-center justify-center px-5 sm:px-10 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="bg-nyumba-emerald p-2 rounded-xl text-white shadow-soft">
              <Shield size={20} className="fill-white" />
            </div>
            <div>
              <span className="display font-bold text-lg leading-none tracking-tightest text-nyumba-ink">
                Nyumba<span className="text-nyumba-emerald">Plug</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.22em] mt-0.5 text-nyumba-terracotta">
                Verified Kenya Rentals
              </span>
            </div>
          </Link>

          <h1 className="display font-semibold text-3xl text-nyumba-ink leading-tight">Join NyumbaPlug</h1>
          <p className="text-sm text-slate-500 mt-2 mb-8">Create your account in under a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">I want to…</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={`flex flex-col items-start gap-1 text-left p-3.5 rounded-xl border transition ${
                      role === r.key
                        ? 'bg-nyumba-emerald text-white border-nyumba-emerald shadow-soft'
                        : 'bg-white text-slate-600 border-nyumba-line hover:border-nyumba-emerald'
                    }`}
                  >
                    <span className={`${role === r.key ? 'text-white' : 'text-nyumba-emerald'}`}>{r.icon}</span>
                    <span className="text-sm font-bold">{r.label}</span>
                    <span className={`text-[10px] ${role === r.key ? 'text-white/80' : 'text-slate-400'}`}>
                      {r.blurb}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {role === 'customer' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-white focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                  <User size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
              <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-white focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
              <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-white focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            {role === 'agent' && (
              <p className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-nyumba-emeraldLight border border-nyumba-emerald/20 p-2.5 rounded-lg">
                <BadgeCheck size={14} className="text-nyumba-emerald shrink-0 mt-0.5" />
                After registering, you'll submit your national ID for verification before you can list properties.
              </p>
            )}

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary !rounded-xl !py-3 disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="inline-flex items-center gap-0.5 text-nyumba-emerald font-semibold hover:underline">
              Sign in
              <ArrowRight size={12} />
            </Link>
          </p>
        </div>
      </div>

      {/* Right — editorial panel */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop"
          alt="Rental home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nyumba-navy/90 via-nyumba-navy/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-10">
          <div className="inline-flex items-center gap-1.5 bg-white/95 text-nyumba-emerald text-[11px] font-bold px-3 py-1.5 rounded-full mb-4">
            <ShieldCheckIcon />
            Join the verified rental marketplace
          </div>
          <h2 className="display text-white font-semibold text-3xl leading-tight max-w-md">
            Tenants get safe listings. Agents get serious enquiries.
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li className="flex items-center gap-2"><BadgeCheck size={15} className="text-nyumba-emerald" /> ID-verified agents only</li>
            <li className="flex items-center gap-2"><BadgeCheck size={15} className="text-nyumba-emerald" /> Scam-checked listings</li>
            <li className="flex items-center gap-2"><BadgeCheck size={15} className="text-nyumba-emerald" /> Contact revealed only for vacant, verified units</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ShieldCheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
