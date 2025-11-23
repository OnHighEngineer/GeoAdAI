'use client';

import { generateAdPlanAction } from '@/app/actions';
import type { AdPlan } from '@/lib/types';
import React, { useState, useTransition } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '../ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import Logo from '../icons/logo';
import { AdPlanDisplay } from './ad-plan-display';
import { Welcome } from './welcome';
import { Loading } from './loading';
import type { GenerateAdPlanInput } from '@/ai/flows/generate-ad-plan';
import { ChatInterface } from './chat-interface';
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';

export default function DashboardClient() {
  const [adPlan, setAdPlan] = useState<AdPlan | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(true);

  const handleSubmit = (values: GenerateAdPlanInput) => {
    startTransition(async () => {
      setAdPlan(null);
      setShowChat(false);
      const result = await generateAdPlanAction(values);
      if (result.success) {
        setAdPlan(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Generating Plan',
          description: result.error,
        });
        setShowChat(true); // Re-show chat on error
      }
    });
  };

  const handleEdit = () => {
    setAdPlan(null);
    setShowChat(true);
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
            <p className="text-sm text-muted-foreground">
              Let's gather some information to create your advertising plan.
            </p>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <h2 className="text-lg font-semibold">
            {adPlan ? 'Generated Advertising Plan' : 'Ad Targeting Simulator'}
          </h2>
          {adPlan ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div></div>
          )}
        </header>
        <main className="p-4 md:p-6">
          {!adPlan && !isPending && showChat && (
            <ChatInterface onSubmit={handleSubmit} isPending={isPending} />
          )}
          {!isPending && !adPlan && !showChat && <Welcome />}
          {isPending && <Loading />}
          {!isPending && adPlan && <AdPlanDisplay adPlan={adPlan} />}
        </main>
      </SidebarInset>
    </>
  );
}
