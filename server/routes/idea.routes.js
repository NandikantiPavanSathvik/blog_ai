// ============================================
// Idea Generator Routes
// ============================================
// POST /api/ideas/generate - Generate blog ideas
// ============================================

import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { generateIdeas } from '../controllers/idea.controller.js';

const router = express.Router();

// All idea routes require authentication
router.use(protect);

// POST /api/ideas/generate
router.post('/generate', generateIdeas);

export default router;

