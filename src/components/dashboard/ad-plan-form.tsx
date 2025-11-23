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
import { useToast } from '@/hooks/use-toast';

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
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  
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

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using a free, no-API-key-required reverse geocoding service
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch location data.');
          }
          const data = await response.json();
          const { country, city } = data.address;
          if (country) {
            form.setValue('country', country, { shouldValidate: true });
          }
          if (city) {
            form.setValue('city', city, { shouldValidate: true });
          }
          toast({
            title: 'Location set!',
            description: `City set to ${city}, Country set to ${country}.`,
          });
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Could not determine location.',
            description: 'Please enter your city and country manually.',
          });
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        toast({
          variant: 'destructive',
          title: 'Unable to retrieve your location.',
          description: 'Please ensure location services are enabled in your browser and try again.',
        });
        setIsLocating(false);
      }
    );
  };

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
             <Button type="button" variant="outline" className="w-full" onClick={handleUseMyLocation} disabled={isLocating}>
                {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                {isLocating ? 'Getting Location...' : 'Use My Location'}
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
