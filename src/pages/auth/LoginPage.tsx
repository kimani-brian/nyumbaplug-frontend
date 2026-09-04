import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import logo from '../../assets/logo.png';

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
                  {showPwd ? <Icon name="visibility_off" size={16} /> : <Icon name="visibility" size={16} />}
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
              <Icon name="arrow_forward" size={12} />
            </Link>
          </p>
        </div>
    </div>
  );
};
