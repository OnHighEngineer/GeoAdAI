import { config } from 'dotenv';
config();

import '@/ai/flows/create-audience-segments.ts';
import '@/ai/flows/suggest-geo-strategy.ts';
import '@/ai/flows/estimate-campaign-performance.ts';
import '@/ai/flows/generate-ad-plan.ts';
import '@/ai/flows/generate-ad-creatives.ts';