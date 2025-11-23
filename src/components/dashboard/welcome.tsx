'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Globe, LineChart } from 'lucide-react';

type WelcomeProps = {
  onStart: () => void;
};

export function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          GeoTarget AI
        </h1>
        <h2 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">
          AI-Powered Geo-Contextual Ad Targeting Simulator
        </h2>
        <p className="mt-4 text-xl text-muted-foreground font-light">
          Predict. Optimize. Dominate.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Globe className="h-10 w-10 text-primary" />
              Global Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Pinpoint your audience anywhere on the globe with hyper-local precision.
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <BrainCircuit className="h-10 w-10 text-primary" />
              AI-Powered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Leverage advanced AI to uncover hidden audience segments and opportunities.
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <LineChart className="h-10 w-10 text-primary" />
              ROI Focused
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get data-driven strategies designed to maximize your return on investment.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16">
        <Button size="lg" onClick={onStart} className="text-lg">
          Start Generating Campaign
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
