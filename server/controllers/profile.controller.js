// ============================================
// Profile Controller
// ============================================
// Handles reading and saving business profiles.
// Enforces that every profile is scoped to the authenticated user (req.user._id).
// ============================================

import BusinessProfile from '../models/BusinessProfile.js';

// @desc    Get current user's business profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(200).json({
        success: true,
        profile: null,
        message: 'No business profile found. Please set one up.',
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business profile',
    });
  }
};

// @desc    Create or update business profile
// @route   POST /api/profile
// @access  Private
export const upsertProfile = async (req, res) => {
  try {
    const {
      businessName,
      industry,
      description,
      productsOrServices,
      targetAudience,
      brandVoice,
      preferredLanguage,
      websiteUrl,
      defaultCta,
    } = req.body;

    // Validate required fields
    if (!businessName || !industry || !description || !targetAudience) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide business name, industry, description, and target audience.',
      });
    }

    const profileData = {
      userId: req.user._id,
      businessName,
      industry,
      description,
      productsOrServices: productsOrServices || '',
      targetAudience,
      brandVoice: brandVoice || 'Conversational & Friendly',
      preferredLanguage: preferredLanguage || 'English',
      websiteUrl: websiteUrl || '',
      defaultCta: defaultCta || '',
    };

    // Find and update if exists, otherwise create new (upsert)
    const profile = await BusinessProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Business profile saved successfully!',
      profile,
    });
  } catch (error) {
    console.error('Upsert Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save business profile',
    });
  }
};
