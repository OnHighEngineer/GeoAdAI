import {
  BarChart3,
  CircleDollarSign,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdPlan } from '@/lib/types';

type KpiCardsProps = {
  kpis: AdPlan['kpis'];
};

export function KpiCards({ kpis }: KpiCardsProps) {
  const kpiData = [
    {
      title: 'Estimated Reach',
      value: kpis.estimated_reach.toLocaleString(),
      icon: Users,
    },
    {
      title: 'Estimated CTR',
      value: `${kpis.estimated_ctr_percent}%`,
      icon: BarChart3,
    },
    {
      title: 'Confidence Score',
      value: `${kpis.confidence_score_percent}%`,
      icon: ShieldCheck,
    },
    {
      title: 'Budget Level',
      value: kpis.budget_level,
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
