import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/UI';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';

// ── Protected route wrapper ──────────────────────────────────────────────────
function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ── Public route: redirect logged-in users away from auth pages ──────────────
function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// ── Inner app (has access to AuthContext) ────────────────────────────────────
function AppRoutes() {
  const { toasts, toast } = useToast();

  return (
    <>
      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Auth */}
        <Route path="/login"  element={<PublicOnly><LoginPage  toast={toast} /></PublicOnly>} />
        <Route path="/signup" element={<PublicOnly><SignupPage toast={toast} /></PublicOnly>} />

        {/* Protected App */}
        <Route path="/dashboard" element={<Protected><Layout><DashboardPage toast={toast} /></Layout></Protected>} />
        <Route path="/projects"  element={<Protected><Layout><ProjectsPage  toast={toast} /></Layout></Protected>} />
        <Route path="/tasks"     element={<Protected><Layout><TasksPage     toast={toast} /></Layout></Protected>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer toasts={toasts} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
