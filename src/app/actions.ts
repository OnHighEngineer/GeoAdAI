'use server';

import {
  suggestGeoStrategy,
  type SuggestGeoStrategyInput,
} from '@/ai/flows/suggest-geo-strategy';

export async function generateAdPlanAction(input: SuggestGeoStrategyInput) {
  try {
    const adPlan = await suggestGeoStrategy(input);
    if (!adPlan) {
      throw new Error(
        'Failed to generate ad plan. The AI model returned no output.'
      );
    }
    return { success: true, data: adPlan };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
