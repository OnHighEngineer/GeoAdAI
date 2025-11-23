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
import type { SuggestGeoStrategyInput } from '@/ai/flows/suggest-geo-strategy';
import { SuggestGeoStrategyInputSchema } from '@/ai/flows/suggest-geo-strategy';

type AdPlanFormProps = {
  onSubmit: (values: SuggestGeoStrategyInput) => void;
  isPending: boolean;
};

// Getting the schema from the AI flow
const FormSchema = SuggestGeoStrategyInputSchema;

const defaultValues: Partial<SuggestGeoStrategyInput> = {
  business_name: 'UrbanBloom Cafe',
  business_description:
    'A modern, cozy cafe in downtown offering artisanal coffee, pastries, and light lunches. We focus on locally sourced, organic ingredients.',
  campaign_objective: 'Increase foot traffic during weekday mornings.',
  country: 'USA',
  city: 'San Francisco',
  area: 'Financial District',
  urban_type: 'urban',
  budget_level: 'medium',
  preferred_channels: 'Mobile, In-app, Social Media',
  target_customer_notes:
    'Young professionals, 25-40, working in nearby offices. Tech-savvy, values quality and convenience. Active on Instagram and LinkedIn.',
};

export function AdPlanForm({ onSubmit, isPending }: AdPlanFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        id="ad-plan-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <fieldset disabled={isPending} className="space-y-4">
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Joe's Pizza" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="business_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business in a few sentences."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="campaign_objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Objective</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Increase online sales" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area/Neighborhood</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SoHo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="urban_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urban Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., urban, suburban" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a budget level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="preferred_channels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Channels</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Social Media, Search" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target_customer_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Customer Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your ideal customer."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide any details about your target audience.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  );
}
