import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';

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
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      footer={
        <>
          No account?{' '}
          <Link to="/register" className="inline-flex items-center gap-0.5 text-primary font-medium hover:underline">
            Register here
            <Icon name="arrow_forward" size={12} />
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-fg/70 mb-1.5" htmlFor="email">
            Email
          </label>
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
          <label className="block text-xs font-medium text-fg/70 mb-1.5" htmlFor="password">
            Password
          </label>
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

        {error && (
          <p role="alert" className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
            {error}
          </p>
        )}

        <div className="pt-1">
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Icon name="progress_activity" size={15} className="animate-spin" /> Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};
