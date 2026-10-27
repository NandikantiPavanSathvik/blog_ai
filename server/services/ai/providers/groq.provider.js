// ============================================
// Groq Provider Connector (Ultra-Fast & Free Tier)
// ============================================
// Connects to Groq cloud running Llama 3.3 70B Versatile.
// Uses OpenAI-compatible endpoints so it's ultra reliable.
// ============================================

import 'dotenv/config';
import OpenAI from 'openai';

class GroqProvider {
  constructor() {
    this.name = 'groq';
  }

  getApiKey() {
    return process.env.GROQ_API_KEY || '';
  }

  isConfigured() {
    const key = this.getApiKey();
    return !!key && key.trim() !== '' && key !== 'your-groq-api-key-here';
  }

  getClient() {
    const key = this.getApiKey();
    return new OpenAI({
      apiKey: key,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async generate(prompt, systemInstruction = '') {
    if (!this.isConfigured()) {
      throw new Error('Groq API key is not configured in server/.env');
    }

    const client = this.getClient();

    // 1. Fetch live available models directly from Groq API
    let activeModel = 'llama-3.1-8b-instant';
    try {
      const modelList = await client.models.list();
      const models = modelList.data.map((m) => m.id);
      console.log('Available Groq models for your key:', models);

      // Filter out non-text/guard/audio/restricted models
      const chatModels = models.filter(
        (id) =>
          !id.includes('guard') &&
          !id.includes('whisper') &&
          !id.includes('vision') &&
          !id.includes('embed') &&
          !id.includes('canopylabs') &&
          !id.includes('safeguard')
      );

      // Prioritize the top open-source models available on your account
      const preferred =
        chatModels.find((id) => id === 'openai/gpt-oss-120b') ||
        chatModels.find((id) => id === 'openai/gpt-oss-20b') ||
        chatModels.find((id) => id.includes('qwen')) ||
        chatModels.find((id) => id.includes('allam')) ||
        chatModels[0];

      if (preferred) {
        activeModel = preferred;
      }
    } catch (listErr) {
      console.warn('Could not list models, using fallback default:', listErr.message);
    }

    console.log(`Generating with Groq model: ${activeModel}`);

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const completion = await client.chat.completions.create({
      model: activeModel,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    });

    return {
      text: completion.choices[0]?.message?.content || '',
      model: activeModel,
      provider: 'groq',
    };
  }
}

export default new GroqProvider();
