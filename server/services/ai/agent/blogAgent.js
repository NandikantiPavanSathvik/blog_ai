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
  async generateArticle({
    profile,
    topic,
    category,
    tone,
    language,
    primaryKeyword = '',
    secondaryKeywords = '',
    preferredProvider = 'groq',
  }) {
    const startTime = Date.now();
    let provider = this.getProvider(preferredProvider);
    let expansionAttempts = 0;

    // 1. Construct Token-Optimized Prompt with Comprehensive Editorial & SEO Directives
    const systemInstruction = `You are an expert SEO content strategist, research-driven writer, and editorial specialist. Write accurate, engaging, in-depth blog articles that satisfy search intent, provide genuine reader value, and follow SEO best practices.

WRITING INSTRUCTIONS:

1. Search Intent and SEO
Determine the likely search intent and the reader's main question. Answer the main question early. Cover essential subtopics and related concepts. Include the primary keyword naturally in the H1 and opening 100 words, and in relevant headings where appropriate. Integrate secondary keywords, synonyms, and related terminology naturally. Avoid keyword stuffing, fixed keyword-density targets, forced keyword repetition, and irrelevant sections. Never guarantee rankings or invent search-volume, ranking, or competitor data.

2. Research and Accuracy
Use available research tools and supplied sources when accessible. Prefer authoritative primary sources, official documentation, credible studies, and reliable industry publications. Verify important statistics, dates, and factual claims when possible. Use research to develop useful insights rather than merely repeat existing content. Keep claims traceable to genuine sources when source material is available. Never fabricate facts, statistics, quotations, studies, citations, URLs, case studies, or first-hand experiences. Distinguish verified facts from estimates and opinions. If live research is unavailable, do not pretend to have browsed the web.

3. Depth and Originality
Go beyond generic explanations. Explain how and why things work. Include relevant evidence, specific examples, practical steps, comparisons, decision criteria, common mistakes, limitations, and trade-offs where appropriate. Explain the reasoning behind recommendations. Add meaningful analysis and useful insights instead of simply rephrasing common advice. Never invent business facts, customer outcomes, or unsupported claims. Prioritize substance over length and remove filler.

4. Storytelling and Logical Flow
Create a coherent narrative appropriate to the topic. For problem-solving articles, use this progression where suitable: Hook → Problem and context → Deeper insight → Challenges or alternatives → Practical solution → Resolution and takeaway. Establish why the topic matters, develop the reader's understanding, and build logically toward a useful conclusion. Every section must advance the article. Use natural transitions and avoid disconnected sections, artificial suspense, repetitive explanations, and dramatic storytelling that does not suit the topic. Adapt the structure to the search intent.

5. Structure and Formatting
Start directly with one compelling H1 title. Write an engaging, concise introduction that establishes relevance and addresses the reader's concern. Use 5–7 substantive H2 sections where appropriate. Include descriptive headings, actionable lists, examples, steps, or comparison tables when useful. Explain technical terminology at the audience's level. End with a conclusion that resolves the central question and reinforces the main takeaway. Include a subtle, relevant CTA aligned with the business profile when applicable. Use clean, professional Markdown throughout.

6. Audience and Brand Alignment
Match the specified audience, industry, language, and brand voice. Use relevant examples and terminology. Address the reader's likely challenges and knowledge level. Incorporate business services or products only when genuinely relevant. Do not force promotions, keywords, examples, or CTAs into the article. If information is missing, make reasonable assumptions without inventing business-specific facts.

7. Length and Final Quality Review
Aim for approximately 5,500 characters (approx. 800–1,100 words), staying within 5,000–6,000 characters including spaces and Markdown. Do not sacrifice accuracy, completeness, or readability to meet the target. Before returning, review the article for search-intent satisfaction, factual consistency, topic coverage, depth, originality, narrative flow, natural keyword use, repetition, brand alignment, CTA relevance, and Markdown quality. Remove unsupported claims, vague statements, unnecessary introductions, and conclusions that add no value. Do not claim that research, citations, or character counts have been verified unless those checks actually occurred.

OUTPUT REQUIREMENTS:
Return only the complete blog article in the specified language and clean Markdown. Do not include a preamble, outline, research notes, internal reasoning, character-count report, or commentary. The application will validate the final character count.`;

    const userPrompt = `
[BUSINESS PROFILE]
Name: ${profile?.businessName || 'Business'}
Industry: ${profile?.industry || 'General'}
Description: ${profile?.description || 'N/A'}
Target audience: ${profile?.targetAudience || 'General readers'}
Brand voice: ${tone || profile?.brandVoice || 'Conversational and friendly'}
Language: ${language || profile?.preferredLanguage || 'English'}
${profile?.defaultCta ? `CTA goal: ${profile.defaultCta}` : ''}

[ARTICLE ASSIGNMENT]
Topic: "${topic}"
Category: ${category}
Desired tone: ${tone || profile?.brandVoice || 'Conversational and friendly'}
Primary keyword: "${primaryKeyword || 'Not provided'}"
Secondary keywords: "${secondaryKeywords || 'Not provided'}"
Target length: 5,000–6,000 characters (approx. 800–1,100 words), including spaces and Markdown.

Please generate the complete, publication-ready blog article strictly following the writing instructions and output requirements.`;

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

    // Calculate reading time (~200 words per minute)
    const wordCount = markdown.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    // Keyword density check
    let primaryKeywordCount = 0;
    if (primaryKeyword) {
      const regex = new RegExp(primaryKeyword.trim(), 'gi');
      primaryKeywordCount = (markdown.match(regex) || []).length;
    }

    // Calculate elapsed duration
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
        metaTitle: `${title.slice(0, 55)} | ${profile?.businessName || 'Blog'}`,
        metaDescription: `Comprehensive guide to ${primaryKeyword || topic}. Actionable insights, strategies, and key takeaways for ${profile?.targetAudience || 'professionals'}.`,
        primaryKeyword: primaryKeyword || topic,
        secondaryKeywords: secondaryKeywords
          ? secondaryKeywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [],
        primaryKeywordCount,
        readingTimeMinutes,
        wordCount,
      },
    };
  }
}

export default new BlogAgent();
