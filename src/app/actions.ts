'use server';

import {
  generateAdPlan,
  type GenerateAdPlanInput,
} from '@/ai/flows/generate-ad-plan';

export async function generateAdPlanAction(input: GenerateAdPlanInput) {
  try {
    const adPlan = await generateAdPlan(input);
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
