'use client';

import { generateAdPlanAction } from '@/app/actions';
import type { AdPlan } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '../ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { AdPlanForm } from './ad-plan-form';
import Logo from '../icons/logo';
import { AdPlanDisplay } from './ad-plan-display';
import { Welcome } from './welcome';
import { Loading } from './loading';

export default function DashboardClient() {
  const [adPlan, setAdPlan] = useState<AdPlan | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (values: AdPlan['kpis']) => {
    startTransition(async () => {
      setAdPlan(null);
      const result = await generateAdPlanAction(values);
      if (result.success) {
        setAdPlan(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Generating Plan',
          description: result.error,
        });
      }
    });
  };

  return (
    <>
      <Sidebar variant="inset" collapsible="offcanvas" side="left">
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <Logo className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold font-headline">AdWiseAI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <div className="p-4">
            <AdPlanForm onSubmit={handleSubmit} />
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Button
            form="ad-plan-form"
            type="submit"
            className="w-full"
            disabled={isPending}
            onClick={() => {
              // This is a trick to trigger form submission from an external button
              document.getElementById('hidden-submit-button')?.click();
            }}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            Generate Plan
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <h2 className="text-lg font-semibold">
            Generated Advertising Plan
          </h2>
          <div></div>
        </header>
        <main className="p-4 md:p-6">
          {!isPending && !adPlan && <Welcome />}
          {isPending && <Loading />}
          {!isPending && adPlan && <AdPlanDisplay adPlan={adPlan} />}
        </main>
      </SidebarInset>
    </>
  );
}
