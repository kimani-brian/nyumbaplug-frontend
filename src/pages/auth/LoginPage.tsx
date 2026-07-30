import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    <div className="min-h-screen bg-nyumba-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-sm w-full p-8">
        <div className="text-center mb-6">
          <div className="bg-nyumba-emerald p-2 rounded-xl inline-flex text-white mb-3">
            <Shield size={28} className="fill-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to NyumbaPlug</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-slate-400">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-nyumba-emerald hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-sm transition"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          No account?{' '}
          <Link to="/register" className="text-nyumba-emerald font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
