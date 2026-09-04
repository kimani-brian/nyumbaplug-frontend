import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrowsePage } from './pages/tenant/BrowsePage';
import { HomePage } from './pages/HomePage';

// Public shell stays eager; everything behind auth or navigation is code-split
// so the initial bundle only carries what a first-time visitor needs.
const PropertyDetailPage = lazy(() => import('./pages/tenant/PropertyDetailPage').then(module => ({ default: module.PropertyDetailPage })));
const LandlordDashboard = lazy(() => import('./pages/landlord/LandlordDashboard').then(module => ({ default: module.LandlordDashboard })));
const LandlordAccount = lazy(() => import('./pages/landlord/LandlordAccount').then(module => ({ default: module.LandlordAccount })));
const CustomerAccount = lazy(() => import('./pages/customer/CustomerAccount').then(module => ({ default: module.CustomerAccount })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const PropertyManagerPropertiesPage = lazy(() => import('./pages/admin/PropertyManagerPropertiesPage').then(module => ({ default: module.PropertyManagerPropertiesPage })));
const PropertyManagerProfilePage = lazy(() => import('./pages/admin/PropertyManagerProfilePage').then(module => ({ default: module.PropertyManagerProfilePage })));
const CustomerProfilePage = lazy(() => import('./pages/admin/CustomerProfilePage').then(module => ({ default: module.CustomerProfilePage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage').then(module => ({ default: module.VerifyEmailPage })));

const PageFallback: React.FC = () => <div className="p-8 text-center text-sm text-fg/50">Loading…</div>;

const suspend = (node: React.ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: 'admin' | 'landlord' | 'tenant' | ('admin' | 'landlord' | 'tenant')[] }> = ({
  children,
  allowedRole,
}) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-sm text-fg/50">Loading…</div>;
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
      <Route path="/properties/:id" element={suspend(<PropertyDetailPage />)} />

      <Route
        path="/landlord"
        element={
          <ProtectedRoute allowedRole="landlord">
            {suspend(<LandlordDashboard />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute allowedRole={['tenant', 'landlord']}>
            {suspend(<AccountPage />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            {suspend(<AdminDashboard />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/property-managers/:landlordId/properties"
        element={
          <ProtectedRoute allowedRole="admin">
            {suspend(<PropertyManagerPropertiesPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/property-managers/:landlordId/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            {suspend(<PropertyManagerProfilePage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers/:customerId/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            {suspend(<CustomerProfilePage />)}
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
    <div className={`min-h-screen flex flex-col bg-page text-fg ${isHome ? '' : 'pt-[72px]'}`}>
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
