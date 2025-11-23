import type { AdPlan } from '@/lib/types';
import { CampaignOverview } from './campaign-overview';
import { KpiCards } from './kpi-cards';
import { GeoStrategySection } from './geo-strategy-section';
import { AudienceSegments } from './audience-segments';
import { AdCreatives } from './ad-creatives';

type AdPlanDisplayProps = {
  adPlan: AdPlan;
};

export function AdPlanDisplay({ adPlan }: AdPlanDisplayProps) {
  return (
    <div className="space-y-6">
      <KpiCards kpis={adPlan.kpis} />
      <CampaignOverview overview={adPlan.campaign_overview} />
      <GeoStrategySection geoStrategy={adPlan.geo_strategy} />
      <AudienceSegments segments={adPlan.audience_segments} />
      <AdCreatives creatives={adPlan.creatives} />
    </div>
  );
}
