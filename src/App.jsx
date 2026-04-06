import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import IdCardPage from './pages/IdCardPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import StudentsPage from './pages/dashboard/StudentsPage';
import IdGeneratorPage from './pages/dashboard/IdGeneratorPage';
import BulkUploadPage from './pages/dashboard/BulkUploadPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin only route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

// Public Route component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes - Accessible to all */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/id-card-generator" element={
              <ProtectedRoute>
                <IdCardPage />
              </ProtectedRoute>
            } />
            
            {/* Login Route - Redirects to dashboard if already logged in */}
            <Route path="/login" element={
              <PublicRoute>
                <div className="pt-24">
                  <Login />
                </div>
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <div className="pt-24">
                  <Signup />
                </div>
              </PublicRoute>
            } />

            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="id-generator" element={
                <AdminRoute>
                  <IdGeneratorPage />
                </AdminRoute>
              } />
              <Route path="bulk-upload" element={
                <AdminRoute>
                  <BulkUploadPage />
                </AdminRoute>
              } />
            </Route>

            {/* Redirect any other path */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
