import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Shield, Mail, KeyRound, BadgeCheck, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const SIDE_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';

export const VerifyEmailPage: React.FC = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { email?: string } };

  const [email, setEmail] = useState(location.state?.email ?? '');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const redirectByRole = (role: string) => {
    if (role === 'landlord') navigate('/landlord', { replace: true });
    else if (role === 'tenant') navigate('/account', { replace: true });
    else navigate('/', { replace: true });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    if (code.trim().length !== 6) {
      setError('Enter the 6-digit code from your email');
      return;
    }
    setSubmitting(true);
    try {
      const user = await verifyEmail(email.trim(), code.trim());
      redirectByRole(user.role);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Check the code and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.includes('@')) {
      setError('Enter your email address first');
      return;
    }
    setError(null);
    setResending(true);
    try {
      await api.resendOtp(email.trim());
      setInfo('A new code has been sent to your email.');
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Could not resend the code. Try again shortly.');
    } finally {
      setResending(false);
    }
  };

  const resendDisabled = resending || cooldown > 0;

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

          <h1 className="display font-semibold text-3xl text-nyumba-ink leading-tight">Verify your email</h1>
          <p className="text-sm text-slate-500 mt-2 mb-8">
            We sent a 6-digit code to your inbox. Enter it below to finish creating your account.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Verification code</label>
              <div className="flex items-center gap-2 px-3.5 py-3 border border-nyumba-line rounded-xl bg-white focus-within:border-nyumba-emerald focus-within:ring-2 focus-within:ring-nyumba-emerald/15 transition">
                <KeyRound size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent text-sm tracking-[0.4em] font-mono focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg">{error}</p>}
            {info && <p className="text-xs text-nyumba-emerald bg-nyumba-emeraldLight border border-nyumba-emerald/20 p-2.5 rounded-lg">{info}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary !rounded-xl !py-3 disabled:opacity-60"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Verifying…</span>
              ) : (
                'Verify & continue'
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-nyumba-emerald py-2 rounded-lg hover:bg-nyumba-emerald/5 disabled:text-slate-400 disabled:cursor-not-allowed transition"
            >
              {resending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RefreshCw size={13} />
              )}
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Code taking long? Check spam, or{' '}
            <Link to="/login" className="text-nyumba-emerald font-semibold hover:underline">
              sign in anyway
            </Link>{' '}
            to log in later.
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
            Secure by design
          </div>
          <h2 className="display text-white font-semibold text-3xl leading-tight max-w-md">
            One-time verification keeps accounts real.
          </h2>
          <p className="text-white/70 text-sm mt-3 max-w-sm leading-relaxed">
            Your code confirms you own this inbox, protecting you and every property manager on NyumbaPlug.
          </p>
        </div>
      </div>
    </div>
  );
};