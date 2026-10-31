// ============================================
// AI Blog Idea Generator Agent
// ============================================
// Orchestrates a multi-step idea generation pipeline:
// 1. Fetches real trending data from Google Trends
// 2. Gets autocomplete keyword suggestions
// 3. Merges with the user's business profile
// 4. Sends everything to the AI to generate
//    structured blog ideas with SEO keywords
// ============================================

import groqProvider from '../providers/groq.provider.js';
import geminiProvider from '../providers/gemini.provider.js';
import openaiProvider from '../providers/openai.provider.js';
import trendsService from '../../trends/trendsService.js';

class IdeaAgent {
  /**
   * Get the best available AI provider
   */
  getProvider(preferred = 'groq') {
    const groqOk = groqProvider.isConfigured();
    const geminiOk = geminiProvider.isConfigured();
    const openaiOk = openaiProvider.isConfigured();

    if (preferred === 'groq' && groqOk) return groqProvider;
    if (preferred === 'gemini' && geminiOk) return geminiProvider;
    if (preferred === 'openai' && openaiOk) return openaiProvider;

    if (groqOk) return groqProvider;
    if (geminiOk) return geminiProvider;
    if (openaiOk) return openaiProvider;

    throw new Error('No AI provider configured.');
  }

  /**
   * Main idea generation pipeline
   */
  async generateIdeas({ profile, topicHint = '', preferredProvider = 'groq' }) {
    const startTime = Date.now();
    const provider = this.getProvider(preferredProvider);

    // ── Step 1: Gather real trending data from Google ──
    let trendingData = {};
    try {
      trendingData = await trendsService.gatherTrendingData(
        profile?.industry || 'Other',
        topicHint
      );
    } catch (err) {
      console.warn('Trends data gathering failed, continuing with AI-only generation:', err.message);
      trendingData = {
        dailyTrends: [],
        industryRelated: [],
        topicRelated: { topQueries: [], risingQueries: [] },
        topicAutocomplete: [],
        seedAutocomplete: [],
        seedKeywords: trendsService.getSeedKeywords(profile?.industry || 'Other'),
      };
    }

    // ── Step 2: Build the context for the AI ──
    const trendingContext = this.buildTrendingContext(trendingData);

    const systemInstruction = `You are a senior SEO content strategist and blog idea consultant. Your job is to generate creative, high-potential blog topic ideas that are:
- Tailored to the user's business profile, industry, and target audience
- Informed by real trending search data and keyword suggestions provided to you
- Optimized for search engine visibility with actionable SEO keywords
- Diverse in format (mix of how-tos, listicles, insights, comparisons, guides)

You must return ONLY valid JSON — no markdown, no code fences, no commentary.

Return a JSON object with this exact structure:
{
  "ideas": [
    {
      "title": "A compelling, click-worthy blog title (50-70 chars ideal)",
      "description": "2-3 sentence description of what this article would cover and why it matters to the target audience",
      "category": "One of: How-To / Tutorial, Industry Insights, Product Showcase, Company News, Tips & Best Practices, Listicle (Top 10 / Best of)",
      "primaryKeyword": "The main SEO keyword to target (2-4 words, search-friendly)",
      "secondaryKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
      "searchIntent": "One of: informational, instructional, comparative, commercial, transactional",
      "trendRelevance": "One of: high, medium, low — based on how closely this aligns with the trending data provided",
      "estimatedDifficulty": "One of: easy, medium, hard — how competitive this topic likely is"
    }
  ]
}

Generate exactly 5 unique blog ideas. Make each idea substantially different from the others.
Ensure the primaryKeyword and secondaryKeywords are realistic search terms people actually use.
Base your keyword suggestions on the trending data provided — do not invent search volumes or difficulty scores.`;

    const userPrompt = `
[BUSINESS PROFILE]
- Business name: ${profile?.businessName || 'Business'}
- Industry: ${profile?.industry || 'General'}
- Description: ${profile?.description || 'Not provided'}
- Products/Services: ${profile?.productsOrServices || 'Not provided'}
- Target audience: ${profile?.targetAudience || 'General readers'}
- Brand voice: ${profile?.brandVoice || 'Conversational & Friendly'}
- Language: ${profile?.preferredLanguage || 'English'}

[REAL-TIME TRENDING DATA FROM GOOGLE]
${trendingContext}

${topicHint ? `[USER'S TOPIC INTEREST]\nThe user is interested in topics related to: "${topicHint}"\nPrioritize ideas around this theme while still using the trending data for SEO keyword suggestions.\n` : '[NO SPECIFIC TOPIC PREFERENCE]\nGenerate diverse ideas based on the business profile and trending data.\n'}
Generate 5 blog ideas with SEO keywords. Return ONLY the JSON object, nothing else.`;

    // ── Step 3: Call the AI provider ──
    const aiResponse = await provider.generate(userPrompt, systemInstruction);

    // ── Step 4: Parse the AI response ──
    let ideas = [];
    try {
      // Clean AI response — strip markdown code fences if present
      let cleaned = aiResponse.text.trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

      const parsed = JSON.parse(cleaned);
      ideas = parsed.ideas || parsed;
    } catch (parseErr) {
      console.error('Failed to parse AI idea response:', parseErr.message);
      console.error('Raw response:', aiResponse.text.substring(0, 500));
      throw new Error('AI returned an invalid response. Please try again.');
    }

    // Validate and normalize each idea
    ideas = ideas.map((idea, index) => ({
      id: index + 1,
      title: idea.title || `Blog Idea ${index + 1}`,
      description: idea.description || '',
      category: idea.category || 'Industry Insights',
      primaryKeyword: idea.primaryKeyword || '',
      secondaryKeywords: Array.isArray(idea.secondaryKeywords) ? idea.secondaryKeywords.slice(0, 8) : [],
      searchIntent: idea.searchIntent || 'informational',
      trendRelevance: idea.trendRelevance || 'medium',
      estimatedDifficulty: idea.estimatedDifficulty || 'medium',
    }));

    const durationMs = Date.now() - startTime;

    return {
      ideas,
      meta: {
        provider: provider.name,
        model: aiResponse.model,
        generationDurationMs: durationMs,
        trendingDataUsed: {
          dailyTrendsCount: trendingData.dailyTrends?.length || 0,
          relatedQueriesFound: (trendingData.industryRelated || []).reduce(
            (sum, r) => sum + (r.topQueries?.length || 0) + (r.risingQueries?.length || 0), 0
          ),
          autocompleteCount: (trendingData.topicAutocomplete?.length || 0) + (trendingData.seedAutocomplete?.length || 0),
        },
      },
    };
  }

  /**
   * Build a readable text block from the trending data for the AI prompt
   */
  buildTrendingContext(data) {
    const sections = [];

    // Daily trending topics
    if (data.dailyTrends?.length > 0) {
      const trendList = data.dailyTrends
        .map((t) => `• "${t.title}" (${t.traffic} searches)`)
        .join('\n');
      sections.push(`Today's Top Trending Searches:\n${trendList}`);
    }

    // Industry-related queries
    if (data.industryRelated?.length > 0) {
      for (const related of data.industryRelated) {
        if (related.topQueries?.length > 0) {
          const topList = related.topQueries.map((q) => `• "${q.query}"`).join('\n');
          sections.push(`Top Related Search Queries in This Industry:\n${topList}`);
        }
        if (related.risingQueries?.length > 0) {
          const risingList = related.risingQueries.map((q) => `• "${q.query}" (rising)`).join('\n');
          sections.push(`Rising / Breakout Search Queries:\n${risingList}`);
        }
      }
    }

    // Topic-specific data
    if (data.topicRelated?.topQueries?.length > 0) {
      const topicList = data.topicRelated.topQueries.map((q) => `• "${q.query}"`).join('\n');
      sections.push(`Related Queries for User's Topic Interest:\n${topicList}`);
    }
    if (data.topicRelated?.risingQueries?.length > 0) {
      const risingList = data.topicRelated.risingQueries.map((q) => `• "${q.query}" (rising)`).join('\n');
      sections.push(`Rising Queries for User's Topic Interest:\n${risingList}`);
    }

    // Autocomplete suggestions
    const allAutocomplete = [
      ...(data.topicAutocomplete || []),
      ...(data.seedAutocomplete || []),
    ];
    if (allAutocomplete.length > 0) {
      const uniqueSuggestions = [...new Set(allAutocomplete)].slice(0, 12);
      const autoList = uniqueSuggestions.map((s) => `• "${s}"`).join('\n');
      sections.push(`Google Autocomplete Suggestions (what people are searching right now):\n${autoList}`);
    }

    if (sections.length === 0) {
      return 'No trending data available. Generate ideas based on industry knowledge and the business profile.';
    }

    return sections.join('\n\n');
  }
}

export default new IdeaAgent();

