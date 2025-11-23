import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, MapPin, PenSquare } from 'lucide-react';

export function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="max-w-2xl mx-auto">
        <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse-slow" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight font-headline">
          Welcome to AdWiseAI
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Your AI-powered geo-contextual advertising assistant. Fill out the
          form in the sidebar to generate a comprehensive ad plan tailored to
          your business needs.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" />
              Audience Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Define and understand your target audience segments.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-primary" />
              Geo-Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get recommendations for the best locations and times to advertise.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenSquare className="text-primary" />
              Creative Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Instantly create compelling ad copy for your campaigns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
