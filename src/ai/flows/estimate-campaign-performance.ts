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

const EstimateCampaignPerformanceInputSchema = z.object({
  business_name: z.string().describe('The name of the business.'),
  business_description: z.string().describe('A description of the business.'),
  campaign_objective: z.string().describe('The objective of the campaign.'),
  country: z.string().describe('The country where the ad will be targeted.'),
  city: z.string().describe('The city where the ad will be targeted.'),
  area: z.string().describe('The area/neighborhood where the ad will be targeted.'),
  urban_type: z.string().describe('The urban type of the target location.'),
  budget_level: z.string().describe('The budget level for the campaign (low, medium, or high).'),
  preferred_channels: z.string().describe('The preferred advertising channels.'),
  target_customer_notes: z.string().describe('Notes about the target customer.'),
});
export type EstimateCampaignPerformanceInput = z.infer<
  typeof EstimateCampaignPerformanceInputSchema
>;

const EstimateCampaignPerformanceOutputSchema = z.object({
  kpis: z.object({
    estimated_reach: z.number().describe('The estimated reach of the campaign.'),
    estimated_ctr_percent: z.number().describe('The estimated click-through rate percentage.'),
    confidence_score_percent: z
      .number()
      .describe('The confidence score percentage of the estimates.'),
    budget_level: z.enum(['low', 'medium', 'high']).describe('The budget level.'),
  }),
  campaign_overview: z.object({
    title: z.string().describe('A short campaign title.'),
    summary: z.string().describe('A 2-3 line explanation of the strategy.'),
    primary_objective: z.string().describe('The primary objective of the campaign.'),
  }),
  geo_strategy: z.object({
    city: z.string().describe('The city where the ad will be targeted.'),
    primary_area: z.string().describe('The primary area within the city.'),
    recommended_radius_km: z.number().describe('The recommended radius in kilometers.'),
    target_regions: z
      .array(
        z.object({
          name: z.string().describe('The name of the area or neighborhood.'),
          priority: z.enum(['high', 'medium', 'low']).describe('The priority level.'),
          reason: z.string().describe('Why this is a good area.'),
        })
      )
      .describe('A list of target regions.'),
    time_windows: z
      .array(
        z.object({
          label: z.string().describe('A label for the time window (e.g., Office commute).'),
          hours_local: z.string().describe('The hours in local time (e.g., 7:00-10:00).'),
          reason: z.string().describe('Why this time is ideal.'),
        })
      )
      .describe('A list of time windows.'),
  }),
  audience_segments: z
    .array(
      z.object({
        segment_name: z.string().describe('The name of the audience segment.'),
        description: z
          .string()
          .describe('Who they are and what they care about (no sensitive traits).'),
        age_range: z.string().describe('The age range of the segment (e.g., 22-35).'),
        interests: z.array(z.string()).describe('A list of interests.'),
        preferred_channels: z
          .array(z.string())
          .describe('A list of preferred advertising channels.'),
      })
    )
    .describe('A list of audience segments.'),
  creatives: z
    .array(
      z.object({
        segment_name: z
          .string()
          .describe('Must match one of audience_segments.segment_name.'),
        ad_format: z.string().describe('e.g., Mobile banner / Video / Native'),
        headline: z.string().describe('Max 60 characters.'),
        primary_text: z.string().describe('1-2 short lines.'),
        call_to_action: z.string().describe('e.g., \'Order Now\''),
        geo_context_hook: z
          .string()
          .describe('Line referencing the local city/area or time of day.'),
      })
    )
    .describe('A list of creatives.'),
});
export type EstimateCampaignPerformanceOutput = z.infer<
  typeof EstimateCampaignPerformanceOutputSchema
>;

export async function estimateCampaignPerformance(
  input: EstimateCampaignPerformanceInput
): Promise<EstimateCampaignPerformanceOutput> {
  return estimateCampaignPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateCampaignPerformancePrompt',
  input: {schema: EstimateCampaignPerformanceInputSchema},
  output: {schema: EstimateCampaignPerformanceOutputSchema},
  prompt: `You are an AI Geo-Contextual Ad Targeting Engine that outputs data for a web dashboard.\n\nYour goal:\nGiven a user's business + location + objective, generate a geo-targeted ad plan.\nThe output MUST be structured so that a frontend dashboard can render:\n- KPI cards
- Geo strategy section
- Audience segments list
- Creatives list\n\nRULES:\n- DO NOT use or infer sensitive traits (religion, caste, race, health, sexual orientation, political views).\n- Use only location, generic demographics, interests, device type, and time behavior.\n- Respond with VALID JSON ONLY. No explanation text.\n\nOUTPUT SCHEMA:\n\n{
  \