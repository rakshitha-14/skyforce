import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './components/LandingPage';
import PendingApproval from './components/PendingApproval';

const AppContent = () => {
  const { isAuthenticated, isApproved, isManager, isAdmin, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="text-sm font-semibold tracking-wider uppercase">Loading User Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showLogin ? (
      <Login onBackToHome={() => setShowLogin(false)} />
    ) : (
      <LandingPage onGetStarted={() => setShowLogin(true)} />
    );
  }

  if (!isApproved && !isAdmin) {
    return <PendingApproval />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return isManager ? <ManagerDashboard /> : <EmployeeDashboard />;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
