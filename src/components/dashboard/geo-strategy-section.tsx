import type { AdPlan } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, MapPin, Maximize } from 'lucide-react';

type GeoStrategySectionProps = {
  geoStrategy: AdPlan['geo_strategy'];
};

const priorityVariantMap: Record<string, 'default' | 'secondary' | 'outline'> =
  {
    high: 'default',
    medium: 'secondary',
    low: 'outline',
  };

export function GeoStrategySection({ geoStrategy }: GeoStrategySectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-4 font-headline">
        Geo-Strategy
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
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
            <p className="text-sm text-muted-foreground">
              Recommended targeting radius around{' '}
              <strong>{geoStrategy.primary_area}</strong> in{' '}
              <strong>{geoStrategy.city}</strong>.
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Maximize /> Target Regions
            </CardTitle>
            <CardDescription>
              Prioritized areas for ad placement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {geoStrategy.target_regions.map((region, index) => (
                <li key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={priorityVariantMap[region.priority]}
                      className="capitalize w-20 justify-center"
                    >
                      {region.priority}
                    </Badge>
                    <span className="font-semibold flex-shrink-0">{region.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground sm:border-l sm:pl-4">
                    {region.reason}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock /> Time Windows
            </CardTitle>
            <CardDescription>
              Optimal times to run advertisements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {geoStrategy.time_windows.map((window, index) => (
                <li key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary w-28 text-right flex-shrink-0">
                      {window.hours_local}
                    </span>
                    <span className="font-semibold ">{window.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground sm:border-l sm:pl-4">
                    {window.reason}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
