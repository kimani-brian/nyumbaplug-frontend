import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import logo from '../../assets/logo.png';

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-page">
      {/* Left — form */}
      <div className="flex items-center justify-center px-5 sm:px-10 py-16">
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

          <h1 className="display font-bold text-3xl text-fg leading-tight">Welcome back</h1>
          <p className="text-sm text-fg/60 mt-2 mb-8">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-fg/80 mb-1.5">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg/80 mb-1.5">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter password"
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
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary !py-3 disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-fg/50 text-center mt-6">
            No account?{' '}
            <Link to="/register" className="inline-flex items-center gap-0.5 text-primary font-semibold hover:underline">
              Register here
              <ArrowRight size={12} />
            </Link>
          </p>
        </div>
      </div>

      {/* Right — editorial panel */}
      <div className="hidden lg:block relative bg-nyumba-ink">
        <div className="absolute inset-0">
          <img src={SIDE_IMG} alt="Verified rental" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        </div>
        <div className="absolute bottom-0 inset-x-0 p-10">
          <div className="inline-flex items-center gap-1.5 bg-primary/20 backdrop-blur border border-primary/30 text-primary text-[11px] font-bold px-3 py-1.5 rounded-full mb-4">
            <BadgeCheck size={13} />
            Verified Kenya Rentals
          </div>
          <h2 className="display text-white font-bold text-3xl leading-tight max-w-md">
            Every rental here is backed by a real, ID-verified property manager.
          </h2>
          <p className="text-white/60 text-sm mt-3 max-w-sm leading-relaxed">
            Sign in to browse scam-checked listings, manage your properties, or run the verification console.
          </p>
        </div>
      </div>
    </div>
  );
};
