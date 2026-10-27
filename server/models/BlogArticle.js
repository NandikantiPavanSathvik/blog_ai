// ============================================
// BlogArticle Model (MongoDB / Mongoose)
// ============================================
// Stores generated articles, generation options, and quality metrics.
// ============================================

import mongoose from 'mongoose';

const blogArticleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    businessProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessProfile',
    },
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Article topic is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'How-To / Tutorial',
        'Industry Insights',
        'Product Showcase',
        'Company News',
        'Tips & Best Practices',
        'Listicle (Top 10 / Best of)',
      ],
      default: 'Industry Insights',
    },
    tone: {
      type: String,
      required: true,
      default: 'Conversational & Friendly',
    },
    language: {
      type: String,
      default: 'English',
    },
    targetCharacterCount: {
      min: { type: Number, default: 5000 },
      max: { type: Number, default: 6000 },
    },
    actualCharacterCount: {
      type: Number,
      required: true,
    },
    contentMarkdown: {
      type: String,
      required: [true, 'Article content is required'],
    },
    // Meta / SEO details generated alongside article
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: [{ type: String, trim: true }],
    },
    // Pipeline diagnostics
    generationDetails: {
      provider: { type: String, enum: ['gemini', 'openai', 'groq'], default: 'groq' },
      modelUsed: { type: String },
      expansionAttempts: { type: Number, default: 0 },
      generationDurationMs: { type: Number },
    },
    status: {
      type: String,
      enum: ['draft', 'edited', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

const BlogArticle = mongoose.model('BlogArticle', blogArticleSchema);
export default BlogArticle;
