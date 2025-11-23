import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let aiInstance: ReturnType<typeof genkit> | null = null;

export function getAI() {
  if (!aiInstance) {
    aiInstance = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-1.5-flash',
    });
  }
  return aiInstance;
}

// Lazy export
export const ai = new Proxy({} as ReturnType<typeof genkit>, {
  get(target, prop) {
    return getAI()[prop as keyof ReturnType<typeof genkit>];
  },
});
