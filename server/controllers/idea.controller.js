// ============================================
// Idea Generator Controller
// ============================================
// Handles blog idea generation requests.
// Fetches the user's business profile, runs the
// idea generation pipeline, and returns structured
// blog ideas with real SEO keyword suggestions.
// ============================================

import BusinessProfile from '../models/BusinessProfile.js';
import ideaAgent from '../services/ai/agent/ideaAgent.js';

/**
 * POST /api/ideas/generate
 * Generate blog ideas based on user profile + trending data
 */
export const generateIdeas = async (req, res) => {
  try {
    const { topicHint, provider } = req.body;

    // 1. Fetch the user's business profile
    const profile = await BusinessProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please set up your business profile first. The Idea Generator uses your profile to suggest relevant blog topics.',
      });
    }

    // 2. Run the idea generation pipeline
    const result = await ideaAgent.generateIdeas({
      profile,
      topicHint: topicHint?.trim() || '',
      preferredProvider: provider || 'groq',
    });

    // 3. Return the ideas
    return res.status(200).json({
      success: true,
      ideas: result.ideas,
      meta: result.meta,
    });
  } catch (err) {
    console.error('Idea generation error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate ideas. Please try again.',
    });
  }
};

