// ============================================
// Article Controller
// ============================================
// Manages blog generation requests and saved articles.
// ============================================

import BlogArticle from '../models/BlogArticle.js';
import BusinessProfile from '../models/BusinessProfile.js';
import User from '../models/User.js';
import blogAgent from '../services/ai/agent/blogAgent.js';

// @desc    Generate a new blog article using AI Agent
// @route   POST /api/articles/generate
// @access  Private
export const generateArticle = async (req, res) => {
  try {
    const {
      topic,
      category,
      tone,
      language,
      primaryKeyword,
      secondaryKeywords,
      provider = 'groq',
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an article topic or title idea',
      });
    }

    // 1. Fetch user's business profile
    const profile = await BusinessProfile.findOne({ userId: req.user._id });

    // 2. Rate limit check (Daily quota)
    const user = await User.findById(req.user._id);
    const today = new Date().toDateString();
    const lastGen = new Date(user.lastGenerationDate || 0).toDateString();

    let countToday = user.generationCountToday || 0;
    if (today !== lastGen) {
      countToday = 0; // Reset counter for new day
    }

    const dailyLimit = parseInt(process.env.GENERATION_LIMIT_PER_DAY) || 10;
    if (countToday >= dailyLimit && user.role !== 'admin') {
      return res.status(429).json({
        success: false,
        message: `Daily generation limit of ${dailyLimit} articles reached. Please return tomorrow!`,
      });
    }

    // 3. Run Custom AI Agent Pipeline with SEO targets
    const agentResult = await blogAgent.generateArticle({
      profile,
      topic,
      category: category || 'Industry Insights',
      tone: tone || profile?.brandVoice || 'Conversational & Friendly',
      language: language || profile?.preferredLanguage || 'English',
      primaryKeyword,
      secondaryKeywords,
      preferredProvider: provider,
    });

    // 4. Save generated draft into MongoDB
    const newArticle = await BlogArticle.create({
      userId: req.user._id,
      businessProfileId: profile?._id,
      title: agentResult.title,
      topic,
      category: category || 'Industry Insights',
      tone: tone || profile?.brandVoice || 'Conversational & Friendly',
      language: language || profile?.preferredLanguage || 'English',
      actualCharacterCount: agentResult.actualCharacterCount,
      targetCharacterCount: agentResult.targetCharacterCount,
      contentMarkdown: agentResult.contentMarkdown,
      seo: agentResult.seo,
      generationDetails: agentResult.generationDetails,
      status: 'draft',
    });

    // 5. Update user daily count
    user.generationCountToday = countToday + 1;
    user.lastGenerationDate = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Article generated and saved successfully!',
      article: newArticle,
      remainingDailyQuota: dailyLimit - (countToday + 1),
    });
  } catch (error) {
    console.error('Generation Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Article generation failed. Please try again.',
    });
  }
};

// @desc    Get user's generated articles
// @route   GET /api/articles
// @access  Private
export const getArticles = async (req, res) => {
  try {
    const articles = await BlogArticle.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-contentMarkdown'); // Exclude full markdown for lightweight list

    res.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
    });
  }
};

// @desc    Get single article with full content
// @route   GET /api/articles/:id
// @access  Private
export const getArticleById = async (req, res) => {
  try {
    const article = await BlogArticle.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.json({
      success: true,
      article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article details',
    });
  }
};

// @desc    Delete single article
// @route   DELETE /api/articles/:id
// @access  Private
export const deleteArticle = async (req, res) => {
  try {
    const article = await BlogArticle.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found or you do not have permission to delete it',
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete article',
    });
  }
};
