import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LandlordProfile, UserRole } from '../types';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  landlordProfile: LandlordProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: string, fullName?: string) => Promise<User>;
  logout: () => void;
  setLandlordProfile: (p: LandlordProfile | null) => void;
  switchDemoRole: (role: UserRole, status?: 'verified' | 'pending' | 'revoked') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [landlordProfile, setLandlordProfile] = useState<LandlordProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nyumbaplug_auth');
    if (stored) {
      try {
        const { token: savedToken, user: savedUser } = JSON.parse(stored);
        setAuthToken(savedToken);
        setUser(savedUser);
        if (savedUser.role === 'landlord') {
          api.getMyLandlordProfile().then(setLandlordProfile).catch(() => {});
        }
      } catch {
        localStorage.removeItem('nyumbaplug_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.login(email, password);
    setUser(res.user);
    localStorage.setItem('nyumbaplug_auth', JSON.stringify({ token: res.token, user: res.user }));
    if (res.user.role === 'landlord') {
      api.getMyLandlordProfile().then(setLandlordProfile).catch(() => {});
    } else {
      setLandlordProfile(null);
    }
    return res.user;
  };

  const register = async (email: string, password: string, role: string, fullName?: string): Promise<User> => {
    const res = await api.register({ email, password, role, full_name: fullName });
    setUser(res.user);
    localStorage.setItem('nyumbaplug_auth', JSON.stringify({ token: res.token, user: res.user }));
    if (res.user.role === 'landlord') {
      api.getMyLandlordProfile().then(setLandlordProfile).catch(() => {});
    } else {
      setLandlordProfile(null);
    }
    return res.user;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setLandlordProfile(null);
    localStorage.removeItem('nyumbaplug_auth');
  };

  const switchDemoRole = (role: UserRole, _status?: 'verified' | 'pending' | 'revoked') => {
    setAuthToken(null);
    if (role === 'admin') {
      setUser({ id: 'demo-admin', role: 'admin', email: 'admin@nyumbaplug.com', phone: '+254700000000', created_at: new Date().toISOString() });
      setLandlordProfile(null);
    } else if (role === 'landlord') {
      setUser({ id: 'demo-landlord', role: 'landlord', email: 'agent@demo.com', phone: '+254711223344', created_at: new Date().toISOString() });
    } else {
      setUser({ id: 'demo-tenant', role: 'tenant', email: 'customer@demo.com', created_at: new Date().toISOString() });
      setLandlordProfile(null);
    }
  };

  return (
      <AuthContext.Provider value={{ user, landlordProfile, loading, login, register, logout, setLandlordProfile, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
