// ============================================
// Google Gemini Provider Connector
// ============================================
// Uses @google/generative-ai to interface with Gemini 2.5/1.5 Flash.
// ============================================

import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiProvider {
  constructor() {
    this.name = 'gemini';
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY || '';
  }

  isConfigured() {
    const key = this.getApiKey();
    return !!key && key.trim() !== '' && key !== 'your-gemini-api-key-here';
  }

  getClient() {
    const key = this.getApiKey();
    return new GoogleGenerativeAI(key);
  }

  async generate(prompt, systemInstruction = '') {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured in server/.env');
    }

    const client = this.getClient();
    // Tested, active Google Gemini models
    const candidateModels = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
    ];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = client.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction || undefined,
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return {
          text: response.text(),
          model: modelName,
          provider: 'gemini',
        };
      } catch (err) {
        lastError = err;
        // If not a 404, throw immediately (e.g. invalid key)
        if (!err.message?.includes('404') && !err.message?.includes('not found')) {
          throw err;
        }
      }
    }

    throw lastError || new Error('Failed to generate with available Gemini models');
  }
}

export default new GeminiProvider();
