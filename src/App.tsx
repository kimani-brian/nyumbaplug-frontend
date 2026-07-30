import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrowsePage } from './pages/tenant/BrowsePage';
import { PropertyDetailPage } from './pages/tenant/PropertyDetailPage';
import { LandlordDashboard } from './pages/landlord/LandlordDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AgentPropertiesPage } from './pages/admin/AgentPropertiesPage';
import { AgentProfilePage } from './pages/admin/AgentProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: 'admin' | 'landlord' }> = ({
  children,
  allowedRole,
}) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-sm text-slate-400">Loading...</div>;
  if (!user || user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BrowsePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agents/:landlordId/properties"
        element={
          <ProtectedRoute allowedRole="admin">
            <AgentPropertiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agents/:landlordId/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <AgentProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-nyumba-cream">
          <Navbar />
          <div className="flex-1">
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
