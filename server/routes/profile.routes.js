// ============================================
// Profile Routes
// ============================================

import express from 'express';
import { getProfile, upsertProfile } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All profile endpoints are protected and require a valid session
router.route('/')
  .get(protect, getProfile)
  .post(protect, upsertProfile)
  .put(protect, upsertProfile);

export default router;
