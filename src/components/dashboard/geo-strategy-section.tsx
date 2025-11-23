import type { AdPlan } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Compass, MapPin } from 'lucide-react';

type GeoStrategySectionProps = {
  geoStrategy: AdPlan['geo_strategy'];
};

const priorityVariantMap: Record<string, 'default' | 'secondary' | 'outline'> =
  {
    high: 'default',
    medium: 'secondary',
    low: 'outline',
  };

const priorityColorClass: Record<string, string> =
  {
    high: 'border-destructive/80 text-destructive',
    medium: 'border-accent/80 text-accent-foreground',
    low: 'border-muted-foreground/50 text-muted-foreground',
  };

export function GeoStrategySection({ geoStrategy }: GeoStrategySectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Compass className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight font-headline">
          Geo-Strategy
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin /> Location Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {geoStrategy.recommended_radius_km}
              </span>
              <span className="text-muted-foreground">km radius</span>
            </div>
            <p className="text-sm text-muted-foreground text-justify">
              Recommended targeting radius around{' '}
              <strong>{geoStrategy.primary_area}</strong> in{' '}
              <strong>{geoStrategy.city}</strong>.
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               Target Regions
            </CardTitle>
            <CardDescription>
              Prioritized areas for ad placement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {geoStrategy.target_regions.map((region, index) => (
                <li key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 rounded-lg border transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={priorityVariantMap[region.priority]}
                      className={`capitalize w-20 justify-center ${priorityColorClass[region.priority]}`}
                    >
                      {region.priority}
                    </Badge>
                    <span className="font-semibold flex-shrink-0">{region.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground sm:border-l sm:pl-4 text-justify">
                    {region.reason}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock /> Time Windows
            </CardTitle>
            <CardDescription>
              Optimal times to run advertisements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {geoStrategy.time_windows.map((window, index) => (
                <div key={index} className="p-4 rounded-lg bg-gradient-to-tr from-card to-muted/50 border transition-all hover:shadow-lg hover:-translate-y-0.5">
                   <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg">{window.label}</span>
                      <span className="font-semibold text-primary text-sm bg-primary/10 px-2 py-1 rounded-full">
                        {window.hours_local}
                      </span>
                  </div>
                  <p className="text-sm text-muted-foreground text-justify">
                    {window.reason}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
