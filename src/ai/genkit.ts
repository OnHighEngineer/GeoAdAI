/**
 * @fileoverview This file initializes and exports a singleton Genkit AI instance.
 * It uses a lazy-loading pattern to ensure the AI client is only initialized
 * when first accessed, improving server startup performance.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

let aiInstance: ReturnType<typeof genkit> | null = null;

function getAI() {
  if (!aiInstance) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Only log in development
    if (!isProduction) {
      console.log('[Genkit] Initializing AI instance...');
    }
    
    aiInstance = genkit({
      plugins: [
        googleAI({
          apiKey: process.env.GOOGLE_GENAI_API_KEY,
        }),
      ],
      // ✅ MUST include 'googleai/' prefix
      model: 'googleai/gemini-2.5-pro',
      
      // Disable dev features in production for faster startup
      enableTracingAndMetrics: !isProduction,
    });
    
    if (!isProduction) {
      console.log('[Genkit] AI instance ready with model: googleai/gemini-1.5-flash');
    }
  }
  return aiInstance;
}

/**
 * Lazily exported AI instance.
 * This proxy intercepts access to the `ai` object and calls `getAI()`
 * on first use, ensuring the AI client is initialized just-in-time.
 */
export const ai = new Proxy({} as ReturnType<typeof genkit>, {
  get(target, prop) {
    return getAI()[prop as keyof ReturnType<typeof genkit>];
  },
});