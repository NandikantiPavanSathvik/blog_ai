// ============================================
// Custom AI Blog Agent Pipeline
// ============================================
// Orchestrates multi-step generation:
// 1. Context Assembly: Merges business profile + request options
// 2. Token-Optimized Prompting: Structured prompt without verbose fluff
// 3. Dual-Model Generation: Calls Gemini or OpenAI with auto-fallback
// 4. Output Validation: Measures actual character count
// 5. Intelligent Expansion: Expands sections if below 5000 chars
// ============================================

import geminiProvider from '../providers/gemini.provider.js';
import openaiProvider from '../providers/openai.provider.js';
import groqProvider from '../providers/groq.provider.js';

class BlogAgent {
  // Utility: calculate character count without markdown syntax
  calculateCharacterCount(markdown) {
    if (!markdown) return 0;
    // Strip markdown formatting symbols (#, *, _, `, [], links) to count pure reading text
    const cleanText = markdown
      .replace(/#+\s/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/>\s?/g, '')
      .trim();
    return cleanText.length;
  }

  // Get requested provider with fallback capability
  getProvider(preferred = 'groq') {
    const groqOk = groqProvider.isConfigured();
    const geminiOk = geminiProvider.isConfigured();
    const openaiOk = openaiProvider.isConfigured();

    if (preferred === 'groq' && groqOk) return groqProvider;
    if (preferred === 'openai' && openaiOk) return openaiProvider;
    if (preferred === 'gemini' && geminiOk) return geminiProvider;

    // Fallbacks in order of preference (Groq first for reliability)
    if (groqOk) return groqProvider;
    if (geminiOk) return geminiProvider;
    if (openaiOk) return openaiProvider;

    throw new Error(
      'No AI provider configured. Please provide a valid GROQ_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY in .env'
    );
  }

  // Main generation pipeline
  async generateArticle({ profile, topic, category, tone, language, preferredProvider = 'gemini' }) {
    const startTime = Date.now();
    let provider = this.getProvider(preferredProvider);
    let expansionAttempts = 0;

    // 1. Construct Token-Optimized Prompt
    const systemInstruction = `You are an elite, professional SaaS blog copywriter. 
Your goal is to write a comprehensive, authoritative, deeply engaging blog article formatted in clean Markdown.
CRITICAL REQUIREMENT: The article MUST be comprehensive, in-depth, and reach an extensive length between 5,000 and 6,000 total characters.
Include a compelling H1 title, a captivating introduction, 5-7 informative H2 sections with concrete insights/bullet points, and a motivating conclusion with Call to Action.`;

    const userPrompt = `
[BUSINESS PROFILE]
Name: ${profile?.businessName || 'Business'}
Industry: ${profile?.industry || 'General'}
About: ${profile?.description || 'N/A'}
Audience: ${profile?.targetAudience || 'General readers'}
Brand Voice: ${tone || profile?.brandVoice || 'Conversational & Friendly'}
Language: ${language || profile?.preferredLanguage || 'English'}
${profile?.defaultCta ? `CTA Goal: ${profile.defaultCta}` : ''}

[ARTICLE ASSIGNMENT]
Topic: "${topic}"
Category: ${category}
Desired Tone: ${tone}
Target Length: 5,000 - 6,000 characters.

Structure instructions:
- Start directly with # [Compelling Article Title]
- Provide an engaging opening hook.
- Divide the body into 5 to 7 detailed, substantive sections using ## headings.
- Offer actionable advice, practical examples, and clear takeaways.
- End with a conclusion and a subtle Call to Action aligned with the brand.
- Format strictly in clean Markdown.`;

    // 2. Initial Generation Call (with automatic fallback to alternative provider)
    let aiResponse;
    try {
      aiResponse = await provider.generate(userPrompt, systemInstruction);
    } catch (primaryError) {
      console.warn(`Primary provider (${provider.name}) failed:`, primaryError.message);
      // Try fallback to the other provider if available
      const fallbackProvider = provider.name === 'gemini' ? openaiProvider : geminiProvider;
      if (fallbackProvider.isConfigured()) {
        console.log(`Attempting fallback to ${fallbackProvider.name}...`);
        aiResponse = await fallbackProvider.generate(userPrompt, systemInstruction);
        provider = fallbackProvider;
      } else {
        throw primaryError;
      }
    }

    let markdown = aiResponse.text;
    let charCount = this.calculateCharacterCount(markdown);

    // 3. Validation & Intelligent Expansion Loop
    // If output is below 4,500 characters, request targeted expansion
    if (charCount < 4500) {
      try {
        expansionAttempts++;
        const expandPrompt = `
The following draft article is currently ${charCount} characters, but our target is 5,000-6,000 characters.
Please expand this article by elaborating on the core sections, adding deeper explanations, practical real-world examples, and step-by-step guidance.
Keep the existing structure and tone intact. Return the entire expanded article in Markdown.

DRAFT TO EXPAND:
${markdown}`;

        const expandedResponse = await provider.generate(expandPrompt, systemInstruction);
        const expandedMarkdown = expandedResponse.text;
        const expandedCount = this.calculateCharacterCount(expandedMarkdown);

        // Accept expansion if it made meaningful progress
        if (expandedCount > charCount) {
          markdown = expandedMarkdown;
          charCount = expandedCount;
        }
      } catch (expandErr) {
        console.warn('Expansion pass skipped:', expandErr.message);
      }
    }

    // 4. Extract Title and Metadata
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/[*_]/g, '').trim() : topic;

    // Clean up redundant first H1 from markdown if present so it renders cleanly
    const contentMarkdown = markdown;

    const durationMs = Date.now() - startTime;

    return {
      title,
      contentMarkdown,
      actualCharacterCount: charCount,
      targetCharacterCount: { min: 5000, max: 6000 },
      generationDetails: {
        provider: provider.name,
        modelUsed: aiResponse.model,
        expansionAttempts,
        generationDurationMs: durationMs,
      },
      seo: {
        metaTitle: `${title} | ${profile?.businessName || 'Blog'}`,
        metaDescription: `Read our guide on "${topic}". In-depth insights on ${category.toLowerCase()} for ${profile?.targetAudience || 'readers'}.`,
        keywords: [topic, category, profile?.industry || 'Business'].filter(Boolean),
      },
    };
  }
}

export default new BlogAgent();
