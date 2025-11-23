import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdPlan } from '@/lib/types';
import { Target } from 'lucide-react';

type CampaignOverviewProps = {
  overview: AdPlan['campaign_overview'];
};

export function CampaignOverview({ overview }: CampaignOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">
          {overview.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{overview.summary}</p>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-primary" />
          <span>
            <strong>Primary Objective:</strong> {overview.primary_objective}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
