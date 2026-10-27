// ============================================
// BusinessProfile Model (MongoDB / Mongoose)
// ============================================
// Stores business information reused across all blog generation sessions.
// Each profile belongs to a specific authenticated user (userId).
// ============================================

import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One business profile per user account
    },
    businessName: {
      type: String,
      required: [true, 'Please provide your business or blog name'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    industry: {
      type: String,
      required: [true, 'Please specify your industry or niche'],
      trim: true,
      enum: [
        'Technology & Software',
        'Health & Wellness',
        'Food & Beverage',
        'E-commerce & Retail',
        'Finance & Real Estate',
        'Education & Training',
        'Marketing & Agency',
        'Travel & Hospitality',
        'Personal Blog / Creator',
        'Other',
      ],
      default: 'Other',
    },
    description: {
      type: String,
      required: [true, 'Please provide a brief description of what you do'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    productsOrServices: {
      type: String,
      trim: true,
      maxlength: [1000, 'Products/Services summary cannot exceed 1000 characters'],
      default: '',
    },
    targetAudience: {
      type: String,
      required: [true, 'Please describe your target audience or readers'],
      trim: true,
      maxlength: [500, 'Target audience description cannot exceed 500 characters'],
    },
    brandVoice: {
      type: String,
      enum: [
        'Professional & Authoritative',
        'Conversational & Friendly',
        'Educational & Instructive',
        'Bold & Persuasive',
        'Inspirational & Uplifting',
        'Witty & Playful',
      ],
      default: 'Conversational & Friendly',
    },
    preferredLanguage: {
      type: String,
      default: 'English',
      enum: ['English', 'Spanish', 'French', 'German', 'Hindi', 'Portuguese'],
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: '',
    },
    // Optional Call-to-Action (CTA) preference added to ends of blogs
    defaultCta: {
      type: String,
      trim: true,
      maxlength: [300, 'CTA text cannot exceed 300 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);
export default BusinessProfile;
