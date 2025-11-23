import { z } from 'zod';

export const AdPlanInputSchema = z.object({
  business_name: z.string().describe('The name of the business.'),
  business_description: z.string().describe('A description of the business.'),
  campaign_objective: z.string().describe('The objective of the campaign.'),
  country: z.string().describe('The country where the ad will be targeted.'),
  city: z.string().describe('The city where the ad will be targeted.'),
  area: z
    .string()
    .describe('The area/neighborhood where the ad will be targeted.'),
  urban_type: z.string().describe('The urban type of the target location.'),
  budget_level: z
    .enum(['low', 'medium', 'high'])
    .describe('The budget level for the campaign (low, medium, or high).'),
  preferred_channels: z
    .string()
    .describe('The preferred advertising channels.'),
  target_customer_notes: z
    .string()
    .describe('Notes about the target customer.'),
});

export const AdPlanOutputSchema = z.object({
  kpis: z.object({
    estimated_reach: z.number().describe('The estimated reach of the ad campaign.'),
    estimated_ctr_percent: z.number().describe('The estimated click-through rate percentage.'),
    confidence_score_percent: z.number().describe('The confidence score percentage.'),
    budget_level: z.enum(['low', 'medium', 'high']).describe('The budget level for the campaign.'),
  }),
  campaign_overview: z.object({
    title: z.string().describe('A short campaign title.'),
    summary: z.string().describe('A 2-3 line explanation of the strategy.'),
    primary_objective: z.string().describe('The primary objective of the campaign.'),
  }),
  geo_strategy: z.object({
    city: z.string().describe('The city where the ad will be targeted.'),
    primary_area: z.string().describe('The primary area within the city to target.'),
    recommended_radius_km: z.number().describe('The recommended radius in kilometers around the primary area.'),
    target_regions: z.array(
      z.object({
        name: z.string().describe('The name of the area or neighborhood.'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of targeting this area.'),
        reason: z.string().describe('The reason why this area is a good target.'),
      })
    ).describe('A list of target regions with their priority and reason.'),
    time_windows: z.array(
      z.object({
        label: z.string().describe('A label for the time window (e.g., Office commute).'),
        hours_local: z.string().describe('The hours of the time window in local time (e.g., 7:00-10:00).'),
        reason: z.string().describe('The reason why this time window is ideal.'),
      })
    ).describe('A list of time windows to target with their label, hours, and reason.'),
  }),
  audience_segments: z.array(
    z.object({
      segment_name: z.string().describe('The name of the audience segment.'),
      description: z.string().describe('A description of who they are and what they care about (no sensitive traits).'),
      age_range: z.string().describe('The age range of the audience segment (e.g., 22-35).'),
      interests: z.array(z.string()).describe('A list of interests for the audience segment.'),
      preferred_channels: z.array(z.string()).describe('The preferred advertising channels for the audience segment.'),
    })
  ).describe('A list of audience segments to target.'),
  creatives: z.array(
    z.object({
      segment_name: z.string().describe('Must match one of audience_segments.segment_name.'),
      ad_format: z.string().describe('The format of the ad (e.g., Mobile banner / Video / Native).'),
      headline: z.string().describe('Max 60 characters.'),
      primary_text: z.string().describe('1-2 short lines.'),
      call_to_action: z.string().describe('E.g., Order Now.'),
      geo_context_hook: z.string().describe('A line referencing the local city/area or time of day.'),
    })
  ).describe('A list of creative ad suggestions tailored to specific audience segments.'),
});
