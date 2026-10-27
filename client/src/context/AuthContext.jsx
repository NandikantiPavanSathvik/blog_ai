// ============================================
// Auth Context (React State)
// ============================================
// Shares authentication state across the entire React application:
// - user: Current logged-in user object { id, name, email } or null
// - token: JWT token string or null
// - loading: True while checking existing session on first load
// - login(email, password): Authenticates user
// - register(name, email, password): Creates account
// - logout(): Clears session and redirects
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read token and user synchronously from localStorage on startup (instant!)
  const [token, setToken] = useState(() => localStorage.getItem('blogai_token'));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('blogai_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Validate session with backend quietly in background
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('blogai_token');
      if (!storedToken) return;

      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('blogai_user', JSON.stringify(res.data.user));
        }
      } catch (error) {
        // Only log out if backend explicitly rejects the token as invalid or expired (401)
        if (error.response?.status === 401) {
          console.warn('Session expired. Logging out.');
          logout();
        }
      }
    };

    verifySession();
  }, []);

  // Register function
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('blogai_token', res.data.token);
      localStorage.setItem('blogai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  // Login function
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('blogai_token', res.data.token);
      localStorage.setItem('blogai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('blogai_token');
    localStorage.removeItem('blogai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume AuthContext cleanly in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
