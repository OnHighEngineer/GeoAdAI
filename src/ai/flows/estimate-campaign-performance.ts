'use server';

/**
 * @fileOverview An AI Geo-Contextual Ad Targeting Engine that outputs data for a web dashboard.
 *
 * - estimateCampaignPerformance - A function that handles the ad campaign estimation process.
 * - EstimateCampaignPerformanceInput - The input type for the estimateCampaignPerformance function.
 * - EstimateCampaignPerformanceOutput - The return type for the estimateCampaignPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AdPlanInputSchema, AdPlanOutputSchema } from './schemas';


export type EstimateCampaignPerformanceInput = z.infer<
  typeof AdPlanInputSchema
>;
export type EstimateCampaignPerformanceOutput = z.infer<
  typeof AdPlanOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'estimateCampaignPerformancePrompt',
  input: {schema: AdPlanInputSchema},
  output: {schema: AdPlanOutputSchema},
  prompt: `You are an AI Geo-Contextual Ad Targeting Engine that outputs data for a web dashboard.\n\nYour goal:\nGiven a user's business + location + objective, generate a geo-targeted ad plan.\nThe output MUST be structured so that a frontend dashboard can render:\n- KPI cards
- Geo strategy section
- Audience segments list
- Creatives list\n\nRULES:\n- DO NOT use or infer sensitive traits (religion, caste, race, health, sexual orientation, political views).\n- Use only location, generic demographics, interests, device type, and time behavior.\n- Respond with VALID JSON ONLY. No explanation text.\n\nOUTPUT SCHEMA:\n\n{{ zodSchema output }}
`,
});

const estimateCampaignPerformanceFlow = ai.defineFlow(
  {
    name: 'estimateCampaignPerformanceFlow',
    inputSchema: AdPlanInputSchema,
    outputSchema: AdPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function estimateCampaignPerformance(
  input: EstimateCampaignPerformanceInput
): Promise<EstimateCampaignPerformanceOutput> {
  return estimateCampaignPerformanceFlow(input);
}
