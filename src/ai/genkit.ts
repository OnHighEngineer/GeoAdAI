/**
 * @fileoverview This file initializes and exports a singleton Genkit AI instance.
 * It uses a lazy-loading pattern to ensure the AI client is only initialized
 * when first accessed, improving server startup performance.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let aiInstance: ReturnType<typeof genkit> | null = null;

/**
 * Gets the singleton AI instance, initializing it if necessary.
 * This lazy initialization prevents Genkit from loading during server startup.
 * @returns {ReturnType<typeof genkit>} The configured Genkit AI instance.
 */
function getAI() {
  if (!aiInstance) {
    aiInstance = genkit({
      plugins: [
        googleAI({
          apiKey: process.env.GOOGLE_GENAI_API_KEY,
        }),
      ],
      model: 'gemini-pro', // Switched to a stable and widely available model
    });
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
