import {
  BarChart3,
  CircleDollarSign,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdPlan } from '@/lib/types';
import { Progress } from '../ui/progress';

type KpiCardsProps = {
  kpis: AdPlan['kpis'];
};

const confidenceColor = (score: number) => {
    if (score > 85) return 'bg-green-500';
    if (score > 70) return 'bg-yellow-500';
    return 'bg-red-500';
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const kpiData = [
    {
      title: 'Estimated Reach',
      value: kpis.estimated_reach.toLocaleString(),
      icon: Users,
    },
    {
      title: 'Estimated CTR',
      value: `${kpis.estimated_ctr_percent.toFixed(2)}%`,
      icon: BarChart3,
    },
    {
      title: 'Budget Level',
      value: kpis.budget_level,
      icon: CircleDollarSign,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="glassmorphism transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
      <Card className="glassmorphism transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{kpis.confidence_score_percent}%</div>
            <Progress value={kpis.confidence_score_percent} indicatorClassName={confidenceColor(kpis.confidence_score_percent)} />
          </CardContent>
        </Card>
    </section>
  );
}
