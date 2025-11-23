'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { GenerateAdPlanInput } from '@/ai/flows/generate-ad-plan';
import { AdPlanInputSchema } from '@/ai/flows/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, LocateFixed, Sparkles } from 'lucide-react';
import { Slider } from '../ui/slider';
import { useState } from 'react';
import { Badge } from '../ui/badge';

type AdPlanFormProps = {
  onSubmit: (values: GenerateAdPlanInput) => void;
  isPending: boolean;
};

const FormSchema = AdPlanInputSchema;

const defaultValues: Partial<GenerateAdPlanInput> = {
  business_name: '',
  business_description: 'Premium organic coffee beans sourced from Colombia...',
  campaign_objective: 'Increase in-store visits',
  country: '',
  city: '',
  area: '',
  urban_type: 'Urban',
  budget_level: 'medium',
  preferred_channels: 'Mobile, Social Media',
  target_customer_notes: '',
};

const interestsList = [
  'Technology',
  'Fashion',
  'Sports',
  'Travel',
  'Food',
  'Health',
  'Gaming',
  'Music',
];

export function AdPlanForm({ onSubmit, isPending }: AdPlanFormProps) {
  const [budget, setBudget] = useState(1000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const handleFormSubmit = (values: z.infer<typeof FormSchema>) => {
    const budgetLevel = budget < 500 ? 'low' : budget < 5000 ? 'medium' : 'high';
    const finalValues = {
        ...values,
        budget_level: budgetLevel,
        target_customer_notes: `${values.target_customer_notes} Interested in: ${selectedInterests.join(', ')}`
    }
    onSubmit(finalValues);
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
        prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8 max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Target Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <Button type="button" variant="outline" className="w-full">
                <LocateFixed className="mr-2 h-4 w-4" />
                Use My Location
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="business_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product/Service Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Premium organic coffee beans sourced from Colombia..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
                <FormLabel>Campaign Budget: ${budget.toLocaleString()}</FormLabel>
                <FormControl>
                    <Slider
                        defaultValue={[budget]}
                        onValueChange={(value) => setBudget(value[0])}
                        min={100}
                        max={10000}
                        step={100}
                    />
                </FormControl>
            </FormItem>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
                control={form.control}
                name="target_customer_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Age Group</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 18-24, 25-35" {...field} />
                    </FormControl>
                     <FormDescription>Enter age ranges separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormItem>
                <FormLabel>Target Interests ({selectedInterests.length} selected)</FormLabel>
                <FormControl>
                   <div className="flex flex-wrap gap-2">
                        {interestsList.map(interest => (
                            <Badge 
                                key={interest}
                                variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                                onClick={() => toggleInterest(interest)}
                                className="cursor-pointer"
                            >
                                {interest}
                            </Badge>
                        ))}
                   </div>
                </FormControl>
            </FormItem>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate AI Campaign
            </Button>
        </div>
      </form>
    </Form>
  );
}
