import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

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
    setInfo(null);
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
    setInfo(null);
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
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox. Enter it below to finish creating your account."
      footer={
        <>
          Code taking long? Check spam, or{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            sign in anyway
          </Link>{' '}
          to log in later.
        </>
      }
    >
      <form onSubmit={handleVerify} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-fg/70 mb-1.5" htmlFor="email">
            Email
          </label>
          <div className="flex items-center gap-2 px-3.5 py-3 border border-line rounded-lg bg-panel hover:border-fg/25 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition">
            <Icon name="mail" size={16} className="text-fg/40 shrink-0" />
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none !text-fg placeholder:!text-fg/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-fg/70 mb-1.5" htmlFor="code">
            Verification code
          </label>
          <div className="flex items-center gap-2 px-3.5 py-3 border border-line rounded-lg bg-panel hover:border-fg/25 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition">
            <Icon name="key" size={16} className="text-fg/40 shrink-0" />
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              placeholder="••••••"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-transparent text-sm tracking-[0.4em] font-mono focus:outline-none !text-fg placeholder:!text-fg/40"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="text-xs text-primary bg-primary/10 border border-primary/20 p-2.5 rounded-lg">
            {info}
          </p>
        )}

        <div className="pt-1">
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Icon name="progress_activity" size={15} className="animate-spin" /> Verifying…
              </span>
            ) : (
              'Verify & continue'
            )}
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendDisabled}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary py-2 rounded-lg hover:bg-primary-light disabled:text-fg/30 disabled:cursor-not-allowed transition"
          >
            {resending ? (
              <Icon name="progress_activity" size={13} className="animate-spin" />
            ) : (
              <Icon name="refresh" size={13} />
            )}
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </AuthCard>
  );
};
