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
import { 
  ArrowLeft, Share2, Save, Rocket, ClipboardCheck, 
  Trash2, Sparkles, Download, BarChart3, Loader2 
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


type AppState = 'welcome' | 'form' | 'loading' | 'results';

const SAVED_PLAN_KEY = 'adwiseai_saved_plan';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [adPlan, setAdPlan] = useState<AdPlan | null>(null);
  const [isPlanSaved, setIsPlanSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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
      setIsPlanSaved(false);
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
        title: '💾 Plan Saved!',
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

  const handleDownloadReport = async () => {
    const reportElement = document.getElementById('ad-plan-report');
    if (!reportElement || !adPlan) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find the report content to download.',
      });
      return;
    }

    setIsDownloading(true);
    toast({
      title: '📥 Preparing Report',
      description: 'Your campaign report is being generated...',
    });

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: null, // Use element's background
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      const fileName = `${adPlan.campaign_overview.title.replace(/\s+/g, '-')}-Report.pdf`;
      pdf.save(fileName);

      toast({
        title: '✅ Report Downloaded',
        description: `Saved as ${fileName}`,
      });

    } catch(error) {
      console.error("PDF generation error:", error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'An error occurred while generating the PDF.',
      });
    } finally {
      setIsDownloading(false);
    }
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
    <div className="min-h-screen flex flex-col bg-[hsl(var(--dashboard-bg))]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1">
            {appState === 'results' && (
              <Button 
                variant="ghost" 
                onClick={handleBackToForm}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">New Plan</span>
              </Button>
            )}
          </div>

          {/* Center - Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient font-headline">
              AdWiseAI
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {appState === 'results' && (
              <>
                {/* Mobile Menu */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownloadReport} disabled={isDownloading}>
                        {isDownloading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        Download Report
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {isPlanSaved ? (
                        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Plan
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={handleSave}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Plan
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  
                  <Button variant="ghost" onClick={handleDownloadReport} className="gap-2" disabled={isDownloading}>
                    {isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Export
                  </Button>

                  {isPlanSaved ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Saved Plan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your saved ad plan from this browser.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDelete} 
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Yes, delete it
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button variant="outline" onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="gap-2 btn-gradient">
                        <Rocket className="h-4 w-4" />
                        Launch
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <Rocket className="h-5 w-5 text-primary" />
                          Ready to Launch?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will simulate launching your ad campaign. In a real-world application, 
                          this would trigger integration with an ad platform.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLaunch} className="bg-green-600 hover:bg-green-700">
                          Yes, Launch It! 🚀
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="animate-fade-in" id="ad-plan-report">
          {renderContent()}
        </div>
      </main>

      {/* Sticky Footer CTA */}
      {appState === 'results' && (
        <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container p-4">
            <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
              <div className="hidden sm:block">
                <p className="font-semibold">Ready to go live?</p>
                <p className="text-sm text-muted-foreground">
                  Launch your campaign and start reaching your audience
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" className="gap-2 btn-gradient shadow-lg w-full sm:w-auto">
                    <Rocket className="h-5 w-5" />
                    Launch Campaign & Go Live
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      Ready to Launch?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will simulate launching your ad campaign. In a real-world application, 
                      this would trigger integration with an ad platform.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLaunch} className="bg-green-600 hover:bg-green-700">
                      Yes, Launch It! 🚀
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
