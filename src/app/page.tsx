'use client';

import { useState } from 'react';
import type { AdPlan } from '@/lib/types';
import type { GenerateAdPlanInput } from '@/ai/flows/generate-ad-plan';
import { Welcome } from '@/components/dashboard/welcome';
import { AdPlanForm } from '@/components/dashboard/ad-plan-form';
import { Loading } from '@/components/dashboard/loading';
import { AdPlanDisplay } from '@/components/dashboard/ad-plan-display';
import { generateAdPlanAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AppState = 'welcome' | 'form' | 'loading' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [adPlan, setAdPlan] = useState<AdPlan | null>(null);
  const { toast } = useToast();

  const handleStart = () => {
    setAppState('form');
  };
  
  const handleBackToForm = () => {
	setAdPlan(null);
	setAppState('form');
  }

  const handleSubmit = async (values: GenerateAdPlanInput) => {
    setAppState('loading');
    const result = await generateAdPlanAction(values);
    if (result.success) {
      setAdPlan(result.data);
      setAppState('results');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: result.error,
      });
      setAppState('form');
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return <Welcome onStart={handleStart} />;
      case 'form':
        return <AdPlanForm onSubmit={handleSubmit} isPending={false} />;
      case 'loading':
        return <Loading />;
      case 'results':
        return adPlan && <AdPlanDisplay adPlan={adPlan} />;
      default:
        return <Welcome onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between h-16">
        {appState === 'results' ? (
          <Button variant="outline" onClick={handleBackToForm}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
        ) : (
          <div></div>
        )}
        <h1 className="text-xl font-semibold font-headline text-center">AdWiseAI</h1>
		<div></div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
