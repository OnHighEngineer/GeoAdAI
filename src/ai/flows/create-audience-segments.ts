'use server';

/**
 * @fileOverview A flow for creating audience segments based on business and customer information.
 *
 * - createAudienceSegments - A function that creates audience segments.
 * - CreateAudienceSegmentsInput - The input type for the createAudienceSegments function.
 * - CreateAudienceSegmentsOutput - The return type for the createAudienceSegments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateAudienceSegmentsInputSchema = z.object({
  business_name: z.string().describe('The name of the business.'),
  business_description: z.string().describe('A description of the business.'),
  campaign_objective: z.string().describe('The objective of the campaign.'),
  country: z.string().describe('The country where the business is located.'),
  city: z.string().describe('The city where the business is located.'),
  area: z.string().describe('The area/neighborhood where the business is located.'),
  urban_type: z.string().describe('The urban type of the location (e.g., urban, suburban, rural).'),
  budget_level: z.string().describe('The budget level for the campaign (low, medium, high).'),
  preferred_channels: z.string().describe('The preferred advertising channels.'),
  target_customer_notes: z.string().describe('Notes about the target customer.'),
});

export type CreateAudienceSegmentsInput = z.infer<
  typeof CreateAudienceSegmentsInputSchema
>;

const CreateAudienceSegmentsOutputSchema = z.array(z.object({
  segment_name: z.string().describe('The name of the audience segment.'),
  description: z.string().describe('Who they are and what they care about (no sensitive traits).'),
  age_range: z.string().describe('e.g., 22–35'),
  interests: z.array(z.string()).describe('List of interests'),
  preferred_channels: z.array(z.string()).describe('Mobile, In-app, Display, Search, CTV'),
}));

export type CreateAudienceSegmentsOutput = z.infer<
  typeof CreateAudienceSegmentsOutputSchema
>;

export async function createAudienceSegments(
  input: CreateAudienceSegmentsInput
): Promise<CreateAudienceSegmentsOutput> {
  return createAudienceSegmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAudienceSegmentsPrompt',
  input: {schema: CreateAudienceSegmentsInputSchema},
  output: {schema: CreateAudienceSegmentsOutputSchema},
  prompt: `You are an AI Geo-Contextual Ad Targeting Engine.

Given a user's business + location + objective, generate audience segments.

RULES:
- DO NOT use or infer sensitive traits (religion, caste, race, health, sexual orientation, political views).
- Use only location, generic demographics, interests, device type, and time behavior.
- Respond with a valid JSON array matching the output schema.

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

const createAudienceSegmentsFlow = ai.defineFlow(
  {
    name: 'createAudienceSegmentsFlow',
    inputSchema: CreateAudienceSegmentsInputSchema,
    outputSchema: CreateAudienceSegmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
