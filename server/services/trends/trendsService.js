// ============================================
// Google Trends & Autocomplete Service
// ============================================
// Fetches real trending data and keyword suggestions
// from Google Trends (unofficial API) and Google
// Autocomplete to power the Idea Generator.
// ============================================

import googleTrends from 'google-trends-api';

// Map business industries to Google Trends search seeds
const INDUSTRY_SEEDS = {
  'Technology & Software': ['technology', 'software development', 'AI tools', 'SaaS', 'cloud computing'],
  'Health & Wellness': ['health tips', 'wellness', 'mental health', 'fitness', 'nutrition'],
  'Food & Beverage': ['food trends', 'recipes', 'restaurant business', 'healthy eating', 'food industry'],
  'E-commerce & Retail': ['ecommerce trends', 'online shopping', 'retail strategy', 'dropshipping', 'customer experience'],
  'Finance & Real Estate': ['personal finance', 'investing', 'real estate market', 'financial planning', 'cryptocurrency'],
  'Education & Training': ['online learning', 'education technology', 'skill development', 'e-learning', 'career growth'],
  'Marketing & Agency': ['digital marketing', 'social media marketing', 'SEO strategy', 'content marketing', 'branding'],
  'Travel & Hospitality': ['travel trends', 'tourism', 'hotel industry', 'travel tips', 'destination guide'],
  'Personal Blog / Creator': ['blogging tips', 'content creation', 'personal brand', 'creator economy', 'writing tips'],
  'Other': ['business tips', 'industry trends', 'startup growth', 'productivity', 'entrepreneurship'],
};

class TrendsService {
  /**
   * Get seed keywords for a given industry
   */
  getSeedKeywords(industry) {
    return INDUSTRY_SEEDS[industry] || INDUSTRY_SEEDS['Other'];
  }

  /**
   * Fetch daily trending searches from Google Trends
   * Returns an array of trending topic strings
   */
  async getDailyTrends(geo = 'US') {
    try {
      const result = await googleTrends.dailyTrends({ geo });
      const parsed = JSON.parse(result);
      const days = parsed?.default?.trendingSearchesDays || [];

      const trends = [];
      for (const day of days.slice(0, 2)) {
        for (const search of (day.trendingSearches || []).slice(0, 10)) {
          trends.push({
            title: search.title?.query || '',
            traffic: search.formattedTraffic || '',
            relatedQueries: (search.relatedQueries || []).map((q) => q.query).slice(0, 5),
          });
        }
      }
      return trends;
    } catch (err) {
      console.warn('Google Trends dailyTrends failed:', err.message);
      return [];
    }
  }

  /**
   * Fetch related queries for a keyword from Google Trends
   * Returns top and rising related queries
   */
  async getRelatedQueries(keyword, geo = 'US') {
    try {
      const result = await googleTrends.relatedQueries({
        keyword,
        geo,
      });
      const parsed = JSON.parse(result);
      const data = parsed?.default?.[keyword] || parsed?.default || {};

      const topQueries = (data?.top || []).map((q) => ({
        query: q.query,
        value: q.value,
      })).slice(0, 10);

      const risingQueries = (data?.rising || []).map((q) => ({
        query: q.query,
        value: q.value,
      })).slice(0, 10);

      return { topQueries, risingQueries };
    } catch (err) {
      console.warn(`Related queries failed for "${keyword}":`, err.message);
      return { topQueries: [], risingQueries: [] };
    }
  }

  /**
   * Fetch Google Autocomplete suggestions for a keyword
   * Uses Google's public suggestion API (no key needed)
   */
  async getAutocompleteSuggestions(keyword) {
    try {
      const encoded = encodeURIComponent(keyword);
      const url = `https://suggestqueries.google.com/complete/search?q=${encoded}&client=firefox`;

      const response = await fetch(url);
      const data = await response.json();

      // Response format: ["query", ["suggestion1", "suggestion2", ...]]
      return (data[1] || []).slice(0, 10);
    } catch (err) {
      console.warn(`Autocomplete failed for "${keyword}":`, err.message);
      return [];
    }
  }

  /**
   * Gather all trending data relevant to a user's industry
   * Combines: daily trends, related queries for industry seeds, and autocomplete
   */
  async gatherTrendingData(industry, topicHint = '') {
    const seeds = this.getSeedKeywords(industry);

    // Run multiple data fetches in parallel for speed
    const promises = [];

    // 1. Daily trending searches
    promises.push(this.getDailyTrends('US'));

    // 2. Related queries for 2 industry-relevant seed keywords
    const seedsToQuery = seeds.slice(0, 2);
    for (const seed of seedsToQuery) {
      promises.push(this.getRelatedQueries(seed));
    }

    // 3. If user gave a topic hint, get related queries + autocomplete for it
    if (topicHint) {
      promises.push(this.getRelatedQueries(topicHint));
      promises.push(this.getAutocompleteSuggestions(topicHint));
    }

    // 4. Autocomplete for the primary seed keyword
    promises.push(this.getAutocompleteSuggestions(seeds[0]));

    const results = await Promise.allSettled(promises);

    // Unpack results safely
    let idx = 0;
    const dailyTrends = results[idx++]?.value || [];

    const relatedByIndustry = [];
    for (const _seed of seedsToQuery) {
      const r = results[idx++]?.value || { topQueries: [], risingQueries: [] };
      relatedByIndustry.push(r);
    }

    let topicRelated = { topQueries: [], risingQueries: [] };
    let topicAutocomplete = [];
    if (topicHint) {
      topicRelated = results[idx++]?.value || { topQueries: [], risingQueries: [] };
      topicAutocomplete = results[idx++]?.value || [];
    }

    const seedAutocomplete = results[idx++]?.value || [];

    return {
      dailyTrends: dailyTrends.slice(0, 8),
      industryRelated: relatedByIndustry,
      topicRelated,
      topicAutocomplete,
      seedAutocomplete,
      seedKeywords: seeds,
    };
  }
}

export default new TrendsService();

