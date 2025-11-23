'use server';

/**
 * @fileOverview A geo-targeted ad plan generator.
 *
 * - suggestGeoStrategy - A function that handles the ad plan generation process.
 * - SuggestGeoStrategyInput - The input type for the suggestGeostrategy function.
 * - SuggestGeoStrategyOutput - The return type for the suggestGeoStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AdPlanInputSchema, AdPlanOutputSchema } from './schemas';

export type SuggestGeoStrategyInput = z.infer<typeof AdPlanInputSchema>;
export type SuggestGeoStrategyOutput = z.infer<typeof AdPlanOutputSchema>;


const prompt = ai.definePrompt({
  name: 'suggestGeoStrategyPrompt',
  input: {schema: AdPlanInputSchema},
  output: {schema: AdPlanOutputSchema},
  prompt: `You are an AI Geo-Contextual Ad Targeting Engine that outputs data for a web dashboard.

Your goal:
Given a user's business + location + objective, generate a geo-targeted ad plan.
The output MUST be structured so that a frontend dashboard can render:
- KPI cards
- Geo strategy section
- Audience segments list
- A list of exactly 3 ad creatives.

RULES:
- DO NOT use or infer sensitive traits (religion, caste, race, health, sexual orientation, political views).
- Use only location, generic demographics, interests, device type, and time behavior.
- Respond with a valid JSON object matching the output schema.

NOW USE THIS USER INPUT:

BUSINESS_NAME: {{{business_name}}}
BUSINESS_DESCRIPTION: {{{business_description}}}

CAMPAIGN_OBJECTIVE: {{{campaign_objective}}}

LOCATION_CONTEXT:
- Country: {{{country}}}
- City: {{{city}}}
- Area/Neighborhood: {{{area}}}
- Urban type: {{{urban_type}}}

BUDGET_LEVEL: {{{budget_level}}}

PREFERRED_CHANNELS: {{{preferred_channels}}}

TARGET_CUSTOMER_NOTES:
{{{target_customer_notes}}}
`,
});

const suggestGeoStrategyFlow = ai.defineFlow(
  {
    name: 'suggestGeoStrategyFlow',
    inputSchema: AdPlanInputSchema,
    outputSchema: AdPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function suggestGeoStrategy(
  input: SuggestGeoStrategyInput
): Promise<SuggestGeoStrategyOutput> {
  return suggestGeoStrategyFlow(input);
}
