import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrowsePage } from './pages/tenant/BrowsePage';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/tenant/PropertyDetailPage';
import { LandlordDashboard } from './pages/landlord/LandlordDashboard';
import { LandlordAccount } from './pages/landlord/LandlordAccount';
import { CustomerAccount } from './pages/customer/CustomerAccount';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PropertyManagerPropertiesPage } from './pages/admin/PropertyManagerPropertiesPage';
import { PropertyManagerProfilePage } from './pages/admin/PropertyManagerProfilePage';
import { CustomerProfilePage } from './pages/admin/CustomerProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: 'admin' | 'landlord' | 'tenant' | ('admin' | 'landlord' | 'tenant')[] }> = ({
  children,
  allowedRole,
}) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-sm text-slate-400">Loading...</div>;
  const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  return user?.role === 'landlord' ? <LandlordAccount /> : <CustomerAccount />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<BrowsePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />

      <Route
        path="/landlord"
        element={
          <ProtectedRoute allowedRole="landlord">
            <LandlordDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute allowedRole={['tenant', 'landlord']}>
            <AccountPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/property-managers/:landlordId/properties"
        element={
          <ProtectedRoute allowedRole="admin">
            <PropertyManagerPropertiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/property-managers/:landlordId/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <PropertyManagerProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers/:customerId/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <CustomerProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const ScrollManager: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        // allow the page to render first, then scroll to the anchor
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

const Shell: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className={`min-h-screen flex flex-col bg-nyumba-cream ${isHome ? '' : 'pt-[72px]'}`}>
      <ScrollManager />
      <Navbar />
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Shell />
      </Router>
    </AuthProvider>
  );
};

export default App;
