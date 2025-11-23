'use server';

/**
 * @fileOverview An AI Geo-Contextual Ad Targeting Engine that outputs a geo-targeted ad plan.
 *
 * - generateAdPlan - A function that handles the generation of the ad plan.
 * - GenerateAdPlanInput - The input type for the generateAdPlan function.
 * - GenerateAdPlanOutput - The return type for the generateAdPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {AdPlanInputSchema, AdPlanOutputSchema} from './schemas';

export type GenerateAdPlanInput = z.infer<typeof AdPlanInputSchema>;
export type GenerateAdPlanOutput = z.infer<typeof AdPlanOutputSchema>;

export async function generateAdPlan(
  input: GenerateAdPlanInput
): Promise<GenerateAdPlanOutput> {
  return generateAdPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdPlanPrompt',
  input: {schema: AdPlanInputSchema},
  output: {schema: AdPlanOutputSchema},
  prompt: `You are an AI Geo-Contextual Ad Targeting Engine that outputs data for a web dashboard.

Your goal:
Given a user's business + location + objective, generate a geo-targeted ad plan.
The output MUST be structured so that a frontend dashboard can render:
- KPI cards
- Geo strategy section
- Audience segments list
- Creatives list

RULES:
- DO NOT use or infer sensitive traits (religion, caste, race, health, sexual orientation, political views).
- Use only location, generic demographics, interests, device type, and time behavior.
- Respond with VALID JSON ONLY. No explanation text.

OUTPUT SCHEMA:
{{- zodSchema output -}}

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

const generateAdPlanFlow = ai.defineFlow(
  {
    name: 'generateAdPlanFlow',
    inputSchema: AdPlanInputSchema,
    outputSchema: AdPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
