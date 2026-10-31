// ============================================
// Main Server File - Express.js Backend
// ============================================
// This is the "brain" of our backend. It:
// 1. Loads environment variables (secret keys, database URL)
// 2. Connects to MongoDB
// 3. Sets up middleware (security, parsing, rate limiting)
// 4. Registers all API routes
// 5. Starts listening for requests
// ============================================

import 'dotenv/config'; // Loads .env immediately before any other imports
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Create the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware Setup
// ============================================
// Middleware = functions that run on EVERY request before
// it reaches your actual route handler. Think of them as
// security guards checking your request at the door.

// CORS: Allows our React frontend (port 5173) to talk to
// our backend (port 5000). Without this, the browser blocks
// the request for security reasons.
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// JSON Parser: Converts incoming JSON data into JavaScript
// objects so we can use them. Without this, req.body is undefined.
app.use(express.json({ limit: '10mb' }));

// URL-encoded Parser: Handles form submissions
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiter: Prevents abuse by limiting how many
// requests one IP address can make. Like a bouncer who says
// "you've been here too many times today, come back later."
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,              // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please wait a few minutes and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// ============================================
// API Routes
// ============================================
// Each route file handles a group of related endpoints.
// We'll add more as we build each phase.

// Health check - a simple endpoint to verify the server is running
// This is like asking "are you alive?" and getting "yes!" back.
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Blog Generator API is running! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// ============================================
// Phase 2 Routes: Authentication
// ============================================
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);

// ============================================
// Phase 3 Routes: Business Profile
// ============================================
import profileRoutes from './routes/profile.routes.js';
app.use('/api/profile', profileRoutes);

// ============================================
// Phase 4 & 5 Routes: Articles & AI Generator
// ============================================
import articleRoutes from './routes/article.routes.js';
app.use('/api/articles', articleRoutes);

// ============================================
// Phase 6 Routes: Idea Generator
// ============================================
import ideaRoutes from './routes/idea.routes.js';
app.use('/api/ideas', ideaRoutes);

// ============================================
// Error Handling
// ============================================

// 404 Handler: If someone requests a URL that doesn't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler: Catches any unhandled errors so the
// server doesn't crash. Instead, it sends a clean error message.
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

// Connect to MongoDB
connectDB();

// If running in traditional Node (not Vercel Serverless)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ==========================================');
    console.log(`🚀  AI Blog Generator Server`);
    console.log(`🚀  Running on: http://localhost:${PORT}`);
    console.log(`🚀  Health:     http://localhost:${PORT}/api/health`);
    console.log(`🚀  Mode:       ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ==========================================');
    console.log('');
  });
}

export default app;
