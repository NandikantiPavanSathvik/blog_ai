// ============================================
// Auth Routes
// ============================================
// Defines API endpoints for authentication:
// POST /api/auth/register - Create account
// POST /api/auth/login    - Sign in
// GET  /api/auth/me       - Get current user profile (protected)
// ============================================

import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
