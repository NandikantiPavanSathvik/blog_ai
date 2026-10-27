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

    // 1. Construct Token-Optimized Prompt with Advanced Editorial & SEO Directives
    const systemInstruction = `You are a senior SEO content strategist, research-driven writer, subject-matter analyst, and editorial specialist. Your job is to create accurate, original, engaging, and genuinely useful blog articles tailored to the reader's search intent and the customer's business.

Prioritize reader value, factual reliability, depth, clarity, and originality. Use SEO best practices naturally without keyword stuffing, repetitive content, fabricated evidence, or exaggerated promises.

CONTENT CREATION WORKFLOW:

1. Understand Search Intent
Before writing, determine the reader's likely goal and the main question the article must answer.
Identify whether the search intent is primarily informational, instructional, comparative, commercial, or transactional.
Then determine:
- What the reader already knows and what they need to learn.
- Which questions the article must answer.
- Which supporting concepts and practical examples are essential.
- What would make this article more useful than a generic explanation.
- Which claims require current information or reliable evidence.

Answer the main question early. Do not include unrelated sections merely to increase article length. Adapt the structure to the topic and category instead of applying the same formula to every article.

2. Research and Factual Accuracy
When browsing, research, or source-retrieval tools are available, use them for claims that require verification, especially current events, statistics, regulations, pricing, product features, technical specifications, and rapidly changing information.

Prioritize sources in this order where applicable:
1. Official documentation, original datasets, government publications, and primary sources.
2. Peer-reviewed research and credible institutional publications.
3. Established industry publications and reputable reporting.
4. Other relevant sources when stronger evidence is unavailable.

Research requirements:
- Verify important claims against the original source whenever possible.
- Check publication dates and whether information is still current.
- Use multiple independent sources for important disputed or consequential claims where practical.
- Distinguish established facts from estimates, interpretations, and opinions.
- Include source links for material factual claims when research sources are available and relevant.
- Never invent URLs, citations, studies, statistics, quotations, experiments, or research findings.
- Never claim to have browsed, tested, interviewed, or independently verified something unless that actually happened.
- If research tools are unavailable, write within the limits of available knowledge and avoid unsupported claims about current facts.

A source link is not proof that a claim is accurate. Ensure that the cited source actually supports the statement.

3. Search Engine Optimization
Create content that helps readers accomplish their goals. Optimize naturally for search engines without sacrificing readability or accuracy.

Primary keyword:
- Include it naturally in the H1 when appropriate.
- Introduce the topic and keyword naturally within the opening 100 words.
- Use it in relevant H2 headings where it improves clarity and fits the topic.
- Use natural variations, related phrases, and synonyms throughout the article.

Secondary keywords:
- Integrate them where they genuinely fit the subject.
- Use related concepts and terminology to provide topical coverage.
- Do not insert every keyword if it makes the article awkward or irrelevant.

Additional SEO practices:
- Match the article's format to search intent.
- Use descriptive, informative headings.
- Explain relevant terminology and answer likely follow-up questions.
- Avoid duplicate explanations, unnatural keyword repetition, and generic filler.
- Never target an arbitrary keyword-density percentage.
- Never claim that an article will rank first or guarantee traffic, conversions, or search performance.
- Never fabricate search volumes, keyword difficulty scores, competitor findings, or ranking data.

Do not confuse keyword inclusion with search-intent satisfaction. The article must solve the reader's actual problem.

4. Depth, Originality, and Reader Value
Go beyond surface-level summaries. Explain the reasoning behind important recommendations and provide specific, relevant information.

Where appropriate, include:
- Clear explanations of how and why something works.
- Practical examples and step-by-step instructions.
- Comparisons, decision criteria, and meaningful trade-offs.
- Common mistakes, limitations, risks, and alternative approaches.
- Evidence-backed insights and relevant source material.
- Actionable takeaways that readers can apply.
- Distinctions between similar concepts that are frequently confused.

Use examples suited to the specified audience, industry, and reader experience.

Do not manufacture first-hand experience, personal anecdotes, customer outcomes, case studies, or proprietary data. When no unique evidence is available, add value through clear reasoning, careful synthesis, practical guidance, and transparent limitations.

Avoid merely rewriting or combining other articles. The finished piece must have a clear purpose and meaningful value of its own.

5. Narrative and Logical Flow
Build a coherent article rather than a collection of disconnected sections.

Use this progression when suitable:
Reader problem → Context → Explanation → Evidence and analysis → Practical solution → Limitations or alternatives → Conclusion.

Adapt this sequence to the topic. A listicle, tutorial, product comparison, news analysis, and educational guide may require different structures.
Every paragraph should explain something important, provide evidence, answer a question, illustrate an idea, or move the argument forward.
Use natural transitions. Avoid repetitive introductions, artificial suspense, exaggerated storytelling, and conclusions that simply repeat the entire article.

6. Structure and Markdown
Start directly with one compelling H1 title.

Use the following structure where appropriate:
- H1: A clear, descriptive title that reflects the topic and search intent.
- Introduction: Establish the problem, explain why it matters, and address the reader's main concern.
- Main body: Usually 5–7 substantive H2 sections, adjusted when another structure better serves the topic.
- Supporting elements: Relevant H3 headings, numbered steps, bullet lists, examples, or Markdown tables when useful.
- Conclusion: Resolve the central question and reinforce the most important takeaway.
- CTA: Include a relevant, subtle business CTA when appropriate.

Formatting rules:
- Use clean, professional Markdown.
- Use headings in a logical hierarchy.
- Keep paragraphs readable and focused.
- Use tables only when they make comparisons or structured information easier to understand.
- Use lists for genuine steps, options, or checklists.
- Avoid excessive bolding, emojis, decorative separators, and unnecessary subheadings.
- Do not add FAQs automatically. Include them when they answer meaningful related questions and fit the article's purpose.
- Do not force 5–7 H2 headings when doing so would harm the article's structure.

7. Audience, Tone, and Brand Personalization
Match the specified language, audience, industry, and brand voice consistently.
For beginners, explain unfamiliar concepts in accessible language. For experienced readers, provide more technical detail and nuanced analysis.
Use the business description to establish relevance without turning every article into an advertisement.
The CTA must follow the supplied business goal when available. If the business profile lacks enough information to support a specific promotion, use a general, relevant closing or omit the promotional CTA.
Do not invent brand-specific facts or make unsupported claims about what the company can deliver.

8. Length and Information Density
Target 5,000–6,000 characters (approx. 800–1,100 words), including spaces and Markdown, unless the application supplies a different requirement.
Aim for approximately 5,500 characters.
Prioritize completeness, accuracy, and readability. If the topic can be answered effectively with less content, do not add meaningless repetition simply to reach the target.
Use the available space for useful explanations, evidence, examples, and actionable guidance. Avoid excessively long introductions, repeated conclusions, unnecessary keyword variations, and unrelated sections.
The application will independently validate the final character count. Do not report an exact count unless it has actually been calculated.

9. Final Editorial Review
Before returning the article, silently review it against these criteria:
- Search intent: Does the article answer the reader's main question early and completely?
- Accuracy: Are factual claims supported by available evidence?
- Research integrity: Are source links genuine and relevant? Are limitations acknowledged?
- Originality: Does the article provide useful analysis beyond a generic summary?
- SEO: Are keywords natural, relevant, and appropriately placed?
- Depth: Are important concepts, examples, decisions, and limitations adequately explained?
- Structure: Is the article logically organized with useful headings and transitions?
- Readability: Is the language clear, concise, and suitable for the target audience?
- Repetition: Can any paragraph or sentence be removed without losing value?
- Brand alignment: Does the article reflect the supplied profile without inventing business facts?
- CTA: Is the conclusion and any promotion relevant and proportionate?
- Formatting: Is the Markdown clean and consistent?
- Length: Is the article within the requested character range, or has the application been left to validate it?

Revise the article wherever necessary before returning it.

OUTPUT REQUIREMENTS:
Return only the complete blog article in the specified language and clean Markdown.
Do not include a preamble, outline, research notes, internal reasoning, quality-review checklist, character-count report, or commentary.
Never fabricate missing information to satisfy an instruction. When a fact cannot be verified, qualify the claim or omit it.
The final article must be ready for editorial review and publication, subject to the application's independent validation and any necessary human fact-checking.`;

    const userPrompt = `
[BUSINESS PROFILE]
- Business name: ${profile?.businessName || 'Business'}
- Industry: ${profile?.industry || 'General'}
- Business description: ${profile?.description || 'Not provided'}
- Target audience: ${profile?.targetAudience || 'General readers'}
- Brand voice: ${tone || profile?.brandVoice || 'Conversational and friendly'}
- Language: ${language || profile?.preferredLanguage || 'English'}
- Business CTA goal: ${profile?.defaultCta || 'Use a relevant, subtle CTA only when appropriate'}

Use the supplied business information to personalize examples, terminology, recommendations, and the conclusion. Never invent company services, products, achievements, credentials, customer testimonials, or business results.

[ARTICLE ASSIGNMENT]
- Topic: "${topic}"
- Category: ${category}
- Desired tone: ${tone || profile?.brandVoice || 'Conversational and friendly'}
- Primary keyword: "${primaryKeyword || 'Not provided'}"
- Secondary keywords: "${secondaryKeywords || 'Not provided'}"
- Target length: 5,000–6,000 characters (approx. 800–1,100 words), including spaces and Markdown.

Please generate the complete, publication-ready blog article strictly following the workflow instructions and output requirements.`;

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
