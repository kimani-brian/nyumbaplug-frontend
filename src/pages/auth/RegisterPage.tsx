import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-nyumba-cream flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-sm w-full p-8">
        <div className="text-center mb-6">
          <div className="bg-nyumba-emerald p-2 rounded-xl inline-flex text-white mb-3">
            <Shield size={28} className="fill-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Join NyumbaPlug</h1>
          <p className="text-xs text-slate-500 mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {(['customer', 'agent'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`text-sm font-semibold py-2.5 px-2 rounded-lg border transition ${
                    role === r
                      ? 'bg-nyumba-emerald text-white border-nyumba-emerald'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {r === 'customer' ? 'Customer' : 'Agent'}
                </button>
              ))}
            </div>
          </div>

          {role === 'customer' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
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

          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-nyumba-emerald hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-sm transition"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-nyumba-emerald font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
