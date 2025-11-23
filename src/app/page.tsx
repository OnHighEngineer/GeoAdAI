'use client';

import { useState, useEffect } from 'react';
import type { AdPlan } from '@/lib/types';
import type { GenerateAdPlanInput } from '@/ai/flows/generate-ad-plan';
import { Welcome } from '@/components/dashboard/welcome';
import { AdPlanForm } from '@/components/dashboard/ad-plan-form';
import { Loading } from '@/components/dashboard/loading';
import { AdPlanDisplay } from '@/components/dashboard/ad-plan-display';
import { generateAdPlanAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Share2, Save, Rocket, ClipboardCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type AppState = 'welcome' | 'form' | 'loading' | 'results';

const SAVED_PLAN_KEY = 'adwiseai_saved_plan';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [adPlan, setAdPlan] = useState<AdPlan | null>(null);
  const [isPlanSaved, setIsPlanSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // On initial load, check if a plan is saved in local storage
    const savedPlanJson = localStorage.getItem(SAVED_PLAN_KEY);
    if (savedPlanJson) {
      try {
        const savedPlan = JSON.parse(savedPlanJson);
        setAdPlan(savedPlan);
        setAppState('results');
        setIsPlanSaved(true);
      } catch (e) {
        console.error("Failed to parse saved ad plan", e);
        localStorage.removeItem(SAVED_PLAN_KEY);
      }
    }
  }, []);

  const handleStart = () => {
    setAppState('form');
  };
  
  const handleBackToForm = () => {
    setAdPlan(null);
    setIsPlanSaved(false);
    localStorage.removeItem(SAVED_PLAN_KEY);
    setAppState('form');
  }

  const handleSubmit = async (values: GenerateAdPlanInput) => {
    setAppState('loading');
    const result = await generateAdPlanAction(values);
    if (result.success) {
      setAdPlan(result.data);
      setAppState('results');
      setIsPlanSaved(false); // A new plan is not saved by default
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: result.error,
      });
      setAppState('form');
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      description: (
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-green-500" />
          <span>Link copied to clipboard!</span>
        </div>
      ),
    });
  };

  const handleSave = () => {
    if (adPlan) {
      localStorage.setItem(SAVED_PLAN_KEY, JSON.stringify(adPlan));
      setIsPlanSaved(true);
      toast({
        title: 'Plan Saved!',
        description: 'Your ad plan has been saved to your browser.',
      });
    }
  };

  const handleDelete = () => {
    localStorage.removeItem(SAVED_PLAN_KEY);
    setIsPlanSaved(false);
    toast({
        title: 'Plan Deleted',
        description: 'Your saved ad plan has been removed.',
        variant: 'destructive'
    });
  }

  const handleLaunch = () => {
    toast({
        title: '🚀 Campaign Launched!',
        description: 'Your campaign is now live. (This is a simulation)',
        className: 'bg-green-500 text-white',
    });
  }


  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return <Welcome onStart={handleStart} />;
      case 'form':
        return <AdPlanForm onSubmit={handleSubmit} isPending={appState === 'loading'} />;
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
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-lg z-10 flex items-center justify-between h-16">
        <div className="flex-1 flex justify-start">
          {appState === 'results' && (
            <Button variant="outline" onClick={handleBackToForm}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Plan
            </Button>
          )}
        </div>
        <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-semibold font-headline text-center">AdWiseAI</h1>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
            {appState === 'results' && (
                <>
                    <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                    {isPlanSaved ? (
                         <Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete Plan</Button>
                    ) : (
                        <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
                    )}
                   
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button><Rocket className="mr-2 h-4 w-4" /> Launch Campaign</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you ready to launch?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will simulate launching your ad campaign. In a real-world application, this would trigger integration with an ad platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLaunch}>
                            Yes, Launch It!
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      {appState === 'results' && (
        <footer className="sticky bottom-0 bg-background/80 backdrop-blur-lg p-4 border-t text-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg"><Rocket className="mr-2 h-5 w-5"/>Launch Campaign & Go Live</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you ready to launch?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will simulate launching your ad campaign. In a real-world application, this would trigger integration with an ad platform.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLaunch}>
                      Yes, Launch It!
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </footer>
      )}
    </div>
  );
}
