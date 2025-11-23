import type { AdPlan } from '@/lib/types';
import { CampaignOverview } from './campaign-overview';
import { KpiCards } from './kpi-cards';
import { GeoStrategySection } from './geo-strategy-section';
import { AudienceSegments } from './audience-segments';
import { AdCreatives } from './ad-creatives';
import { Separator } from '../ui/separator';

type AdPlanDisplayProps = {
  adPlan: AdPlan;
};

export function AdPlanDisplay({ adPlan }: AdPlanDisplayProps) {
  return (
    <div className="space-y-8">
      <CampaignOverview overview={adPlan.campaign_overview} />
      <KpiCards kpis={adPlan.kpis} />
      <Separator />
      <GeoStrategySection geoStrategy={adPlan.geo_strategy} />
      <Separator />
      <AudienceSegments segments={adPlan.audience_segments} />
      <Separator />
      <AdCreatives creatives={adPlan.creatives} />
    </div>
  );
}
