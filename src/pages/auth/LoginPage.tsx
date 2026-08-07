import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Eye, EyeOff, ArrowRight, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SIDE_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'landlord') navigate('/landlord');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

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

          <h1 className="display font-semibold text-3xl text-nyumba-ink leading-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-2 mb-8">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-white focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-white focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary !rounded-xl !py-3 disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            No account?{' '}
            <Link to="/register" className="inline-flex items-center gap-0.5 text-nyumba-emerald font-semibold hover:underline">
              Register here
              <ArrowRight size={12} />
            </Link>
          </p>
        </div>
      </div>

      {/* Right — editorial panel */}
      <div className="hidden lg:block relative">
        <img src={SIDE_IMG} alt="Verified rental" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-nyumba-navy/90 via-nyumba-navy/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-10">
          <div className="inline-flex items-center gap-1.5 bg-white/95 text-nyumba-emerald text-[11px] font-bold px-3 py-1.5 rounded-full mb-4">
            <BadgeCheck size={13} />
            Verified Kenya Rentals
          </div>
          <h2 className="display text-white font-semibold text-3xl leading-tight max-w-md">
            Every rental here is backed by a real, ID-verified property manager.
          </h2>
          <p className="text-white/70 text-sm mt-3 max-w-sm leading-relaxed">
            Sign in to browse scam-checked listings, manage your properties, or run the verification console.
          </p>
        </div>
      </div>
    </div>
  );
};
