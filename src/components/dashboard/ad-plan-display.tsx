import type { AdPlan } from '@/lib/types';
import { CampaignOverview } from './campaign-overview';
import { KpiCards } from './kpi-cards';
import { GeoStrategySection } from './geo-strategy-section';
import { AudienceSegments } from './audience-segments';
import { AdCreatives } from './ad-creatives';
import { Separator } from '../ui/separator';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, Users, MapPin, Palette } from 'lucide-react';

type AdPlanDisplayProps = {
  adPlan: AdPlan;
};

export function AdPlanDisplay({ adPlan }: AdPlanDisplayProps) {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-animated p-8 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <Badge className="mb-4 bg-white/20 backdrop-blur-sm border-white/30">
            <span className="status-dot-live mr-2" />
            AI-Generated Campaign
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Campaign is Ready! 🎉
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            We've analyzed your inputs and created a data-driven campaign strategy 
            tailored to your target audience and location.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <a href="#overview" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <TrendingUp className="w-4 h-4" />
            Overview
          </a>
          <a href="#geo-strategy" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <MapPin className="w-4 h-4" />
            Geo-Strategy
          </a>
          <a href="#audience" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <Users className="w-4 h-4" />
            Audience
          </a>
          <a href="#creatives" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <Palette className="w-4 h-4" />
            Ad Creatives
          </a>
        </div>
      </Card>

      {/* Campaign Overview */}
      <div id="overview">
        <CampaignOverview overview={adPlan.campaign_overview} />
      </div>

      {/* KPI Cards */}
      <KpiCards kpis={adPlan.kpis} />

      <Separator className="my-8" />

      {/* Geo Strategy */}
      <div id="geo-strategy">
        <GeoStrategySection geoStrategy={adPlan.geo_strategy} />
      </div>

      <Separator className="my-8" />

      {/* Audience Segments */}
      <div id="audience">
        <AudienceSegments segments={adPlan.audience_segments} />
      </div>

      <Separator className="my-8" />

      {/* Ad Creatives */}
      <div id="creatives">
        <AdCreatives creatives={adPlan.creatives} />
      </div>

      {/* Success Tips Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <span>💡</span> Pro Tips for Success
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Monitor your campaign performance daily during the first week</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>A/B test different ad creatives to find the best performer</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Adjust your targeting based on early performance data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Set up conversion tracking before launching</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
