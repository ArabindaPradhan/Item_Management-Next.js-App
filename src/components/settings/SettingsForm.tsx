"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import type { CounterResetFrequency } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const settingsFormSchema = z.object({
  maxInTimeMinutes: z.coerce.number().int().positive("Must be a positive number").min(1, "Minimum 1 minute"),
  counterResetFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'never']),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const { settings, updateSettings } = useAppContext();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      maxInTimeMinutes: settings.maxInTimeMinutes,
      counterResetFrequency: settings.counterResetFrequency,
    },
    // Update defaultValues when settings change from context (e.g. on initial load)
    values: {
        maxInTimeMinutes: settings.maxInTimeMinutes,
        counterResetFrequency: settings.counterResetFrequency,
    }
  });

  function onSubmit(data: SettingsFormValues) {
    updateSettings({
        maxInTimeMinutes: data.maxInTimeMinutes,
        counterResetFrequency: data.counterResetFrequency as CounterResetFrequency,
    });
    toast({
      title: "Settings Saved",
      description: "Your new settings have been applied.",
    });
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Application Settings</CardTitle>
        <CardDescription>Configure alerts and data reset behavior for MaterialFlow.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="maxInTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max 'IN' State Time (Minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 60" {...field} />
                  </FormControl>
                  <FormDescription>
                    Highlight orders in 'IN' state longer than this duration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="counterResetFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Counter Reset Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reset frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often the order list and serial number should reset. Resets happen at the end of the selected period.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
