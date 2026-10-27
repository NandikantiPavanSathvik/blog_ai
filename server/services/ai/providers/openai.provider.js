// ============================================
// OpenAI (ChatGPT) Provider Connector
// ============================================
// Uses official openai SDK to interface with GPT-4o / GPT-4o-mini.
// ============================================

import 'dotenv/config';
import OpenAI from 'openai';

class OpenAIProvider {
  constructor() {
    this.name = 'openai';
  }

  getApiKey() {
    return process.env.OPENAI_API_KEY || '';
  }

  isConfigured() {
    const key = this.getApiKey();
    return !!key && key.trim() !== '' && key !== 'your-openai-api-key-here';
  }

  getClient() {
    const key = this.getApiKey();
    return new OpenAI({ apiKey: key });
  }

  async generate(prompt, systemInstruction = '') {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured in server/.env');
    }

    const client = this.getClient();
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Fast, high-quality, token-cost efficient
      messages,
      temperature: 0.7,
      max_tokens: 3500, // Sufficient for ~5000-6000 character output
    });

    return {
      text: completion.choices[0]?.message?.content || '',
      model: 'gpt-4o-mini',
      provider: 'openai',
    };
  }
}

export default new OpenAIProvider();
