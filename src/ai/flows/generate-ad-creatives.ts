'use server';
/**
 * @fileOverview An AI agent that generates geo-targeted ad creatives for different audience segments.
 *
 * - generateAdCreatives - A function that generates ad creatives based on business information, campaign objectives, location context, budget, and target customer notes.
 * - GenerateAdCreativesInput - The input type for the generateAdCreatives function.
 * - GenerateAdCreativesOutput - The return type for the generateAdCreatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdCreativesInputSchema = z.object({
  business_name: z.string().describe('The name of the business.'),
  business_description: z.string().describe('A description of the business.'),
  campaign_objective: z.string().describe('The objective of the ad campaign.'),
  country: z.string().describe('The country where the ad will be targeted.'),
  city: z.string().describe('The city where the ad will be targeted.'),
  area: z.string().describe('The specific area or neighborhood for ad targeting.'),
  urban_type: z.string().describe('The type of urban environment (e.g., suburban, downtown).'),
  budget_level: z.string().describe('The budget level for the ad campaign (low, medium, or high).'),
  preferred_channels: z.string().describe('The preferred advertising channels (e.g., Mobile, In-app, Display).'),
  target_customer_notes: z.string().describe('Notes about the target customer for the ad campaign.'),
});
export type GenerateAdCreativesInput = z.infer<typeof GenerateAdCreativesInputSchema>;

const GenerateAdCreativesOutputSchema = z.object({
  kpis: z.object({
    estimated_reach: z.number(),
    estimated_ctr_percent: z.number(),
    confidence_score_percent: z.number(),
    budget_level: z.enum(['low', 'medium', 'high']),
  }),
  campaign_overview: z.object({
    title: z.string(),
    summary: z.string(),
    primary_objective: z.string(),
  }),
  geo_strategy: z.object({
    city: z.string(),
    primary_area: z.string(),
    recommended_radius_km: z.number(),
    target_regions: z.array(
      z.object({
        name: z.string(),
        priority: z.enum(['high', 'medium', 'low']),
        reason: z.string(),
      })
    ),
    time_windows: z.array(
      z.object({
        label: z.string(),
        hours_local: z.string(),
        reason: z.string(),
      })
    ),
  }),
  audience_segments: z.array(
    z.object({
      segment_name: z.string(),
      description: z.string(),
      age_range: z.string(),
      interests: z.array(z.string()),
      preferred_channels: z.array(z.string()),
    })
  ),
  creatives: z.array(
    z.object({
      segment_name: z.string(),
      ad_format: z.string(),
      headline: z.string(),
      primary_text: z.string(),
      call_to_action: z.string(),
      geo_context_hook: z.string(),
    })
  ),
});
export type GenerateAdCreativesOutput = z.infer<typeof GenerateAdCreativesOutputSchema>;

export async function generateAdCreatives(input: GenerateAdCreativesInput): Promise<GenerateAdCreativesOutput> {
  return generateAdCreativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdCreativesPrompt',
  input: {schema: GenerateAdCreativesInputSchema},
  output: {schema: GenerateAdCreativesOutputSchema},
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

{
  "kpis": {
    "estimated_reach": number,
    "estimated_ctr_percent": number,
    "confidence_score_percent": number,
    "budget_level": "low" | "medium" | "high"
  },
  "campaign_overview": {
    "title": "short campaign title",
    "summary": "2–3 line explanation of the strategy",
    "primary_objective": "string"
  },
  "geo_strategy": {
    "city": "string",
    "primary_area": "string",
    "recommended_radius_km": number,
    "target_regions": [
      {
        "name": "area or neighborhood",
        "priority": "high" | "medium" | "low",
        "reason": "why this is a good area"
      }
    ],
    "time_windows": [
      {
        "label": "e.g., Office commute",
        "hours_local": "e.g., 7:00–10:00",
        "reason": "why this time is ideal"
      }
    ]
  },
  "audience_segments": [
    {
      "segment_name": "string",
      "description": "who they are and what they care about (no sensitive traits)",
      "age_range": "e.g., 22–35",
      "interests": ["list", "of", "interests"],
      "preferred_channels": ["Mobile", "In-app", "Display", "Search", "CTV"]
    }
  ],
  "creatives": [
    {
      "segment_name": "must match one of audience_segments.segment_name",
      "ad_format": "e.g., Mobile banner / Video / Native",
      "headline": "max 60 characters",
      "primary_text": "1–2 short lines",
      "call_to_action": "e.g., 'Order Now'",
      "geo_context_hook": "line referencing the local city/area or time of day"
    }
  ]
}

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
{{{target_customer_notes}}}`,
});

const generateAdCreativesFlow = ai.defineFlow(
  {
    name: 'generateAdCreativesFlow',
    inputSchema: GenerateAdCreativesInputSchema,
    outputSchema: GenerateAdCreativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
