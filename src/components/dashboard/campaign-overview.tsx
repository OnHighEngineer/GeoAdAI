import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdPlan } from '@/lib/types';
import { Target, Trophy } from 'lucide-react';

type CampaignOverviewProps = {
  overview: AdPlan['campaign_overview'];
};

export function CampaignOverview({ overview }: CampaignOverviewProps) {
  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/80 to-accent/80 p-px shadow-lg">
      <Card className="h-full w-full bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <div className='flex items-center gap-3'>
            <Trophy className="w-8 h-8 text-accent" />
            <CardTitle className="font-headline tracking-tight text-3xl md:text-4xl">
              {overview.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground text-justify">{overview.summary}</p>
          <div className="flex items-center gap-3 text-base font-medium p-3 bg-muted/50 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
            <span>
              <strong>Primary Objective:</strong> {overview.primary_objective}
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
