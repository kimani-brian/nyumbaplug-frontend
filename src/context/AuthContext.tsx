import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LandlordProfile, TenantProfile, UserRole } from '../types';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  landlordProfile: LandlordProfile | null;
  customerProfile: TenantProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: string, fullName?: string, pageName?: string) => Promise<{ email: string; message: string }>;
  verifyEmail: (email: string, code: string) => Promise<User>;
  logout: () => void;
  setLandlordProfile: (p: LandlordProfile | null) => void;
  setCustomerProfile: (p: TenantProfile | null) => void;
  setUser: (u: User) => void;
  switchDemoRole: (role: UserRole, status?: 'verified' | 'pending' | 'revoked') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [landlordProfile, setLandlordProfile] = useState<LandlordProfile | null>(null);
  const [customerProfile, setCustomerProfile] = useState<TenantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRoleProfile = (role: string) => {
    if (role === 'landlord') {
      api.getMyLandlordProfile().then(setLandlordProfile).catch(() => {});
    } else if (role === 'tenant') {
      api.getMyCustomerProfile().then(setCustomerProfile).catch(() => {});
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('nyumbaplug_auth');
    if (stored) {
      try {
        const { token: savedToken, user: savedUser } = JSON.parse(stored);
        setAuthToken(savedToken);
        setUser(savedUser);
        loadRoleProfile(savedUser.role);
      } catch {
        localStorage.removeItem('nyumbaplug_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.login(email, password);
    setUserState(res.user);
    localStorage.setItem('nyumbaplug_auth', JSON.stringify({ token: res.token, user: res.user }));
    loadRoleProfile(res.user.role);
    return res.user;
  };

  const register = async (email: string, password: string, role: string, fullName?: string, pageName?: string): Promise<{ email: string; message: string }> => {
    return await api.register({ email, password, role, full_name: fullName, page_name: pageName });
  };

  const verifyEmail = async (email: string, code: string): Promise<User> => {
    const res = await api.verifyEmail(email, code);
    setUserState(res.user);
    localStorage.setItem('nyumbaplug_auth', JSON.stringify({ token: res.token, user: res.user }));
    loadRoleProfile(res.user.role);
    return res.user;
  };

  const logout = () => {
    setAuthToken(null);
    setUserState(null);
    setLandlordProfile(null);
    setCustomerProfile(null);
    localStorage.removeItem('nyumbaplug_auth');
  };

  const setUser = (u: User) => {
    setUserState(u);
    const stored = localStorage.getItem('nyumbaplug_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.user = u;
        localStorage.setItem('nyumbaplug_auth', JSON.stringify(parsed));
      } catch {
        localStorage.removeItem('nyumbaplug_auth');
      }
    }
  };

  const switchDemoRole = (role: UserRole, _status?: 'verified' | 'pending' | 'revoked') => {
    setAuthToken(null);
    setLandlordProfile(null);
    setCustomerProfile(null);
    if (role === 'admin') {
      setUserState({ id: 'demo-admin', role: 'admin', email: 'admin@nyumbaplug.com', phone: '+254700000000', created_at: new Date().toISOString() });
    } else if (role === 'landlord') {
      setUserState({ id: 'demo-landlord', role: 'landlord', email: 'agent@demo.com', phone: '+254711223344', created_at: new Date().toISOString() });
    } else {
      setUserState({ id: 'demo-tenant', role: 'tenant', email: 'customer@demo.com', created_at: new Date().toISOString() });
      setCustomerProfile({ id: 'demo-tenant-profile', user_id: 'demo-tenant', full_name: 'Demo Customer', created_at: new Date().toISOString() });
    }
  };

  return (
      <AuthContext.Provider value={{ user, landlordProfile, customerProfile, loading, login, register, verifyEmail, logout, setLandlordProfile, setCustomerProfile, setUser, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
