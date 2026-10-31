// ============================================
// App.jsx - Main Application Component
// ============================================
// This is the root of our React app. It sets up:
// - The router (which page to show based on the URL)
// - Global providers (auth state, notifications)
// - Layout structure
//
// For now (Phase 1), it just shows the Landing Page.
// We'll add more routes as we build each phase.
// ============================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import GeneratePage from './pages/GeneratePage.jsx';
import ArticlesPage from './pages/ArticlesPage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage.jsx';
import IdeaGeneratorPage from './pages/IdeaGeneratorPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (Require Login) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <GeneratePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <ArticlesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ideas"
            element={
              <ProtectedRoute>
                <IdeaGeneratorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <ProtectedRoute>
                <ArticleDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
