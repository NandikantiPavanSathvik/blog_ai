// ============================================
// Article Routes
// ============================================

import express from 'express';
import {
  generateArticle,
  getArticles,
  getArticleById,
  deleteArticle,
} from '../controllers/article.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, generateArticle);
router.get('/', protect, getArticles);
router.get('/:id', protect, getArticleById);
router.delete('/:id', protect, deleteArticle);

export default router;
