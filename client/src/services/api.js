// ============================================
// API Service - Axios Configuration
// ============================================
// This file sets up Axios (our HTTP client) to talk to
// the Express backend. Think of it as a messenger that
// carries requests from React to Express and brings back responses.
//
// It automatically:
// - Adds the auth token to every request
// - Handles common errors
// - Redirects to login if the token expires
// ============================================

import axios from 'axios';

// Create a pre-configured Axios instance
// All API calls go through this instead of using axios directly
const api = axios.create({
  baseURL: '/api',  // In development, Vite proxies this to localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes (article generation can take a while)
});

// ============================================
// Request Interceptor
// ============================================
// Runs BEFORE every request is sent.
// Attaches the JWT token from localStorage so the backend
// knows which user is making the request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blogai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// ============================================
// Runs AFTER every response is received.
// Handles common errors like expired tokens.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token expired or invalid — redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('blogai_token');
        localStorage.removeItem('blogai_user');
        // Only redirect if not already on auth pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
