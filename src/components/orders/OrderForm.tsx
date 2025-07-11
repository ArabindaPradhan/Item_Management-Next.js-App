"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const orderFormSchema = z.object({
  vehicleNumber: z
    .string()
    .regex(
      /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
      "Enter a valid vehicle number (e.g., MH12AB1234)"
    )
    .optional()
    .or(z.literal("")),
  partyName: z
    .string()
    .min(2, "Party name must be at least 2 characters")
    .max(100, "Party name is too long")
    .optional()
    .or(z.literal("")),
  referenceNumber: z
    .string()
    .regex(
      /^PO-\d+$/,
      "Reference number should start with 'PO-' followed by digits (e.g., PO-789)"
    )
    .optional()
    .or(z.literal("")),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  onFormSubmit: () => void; // Callback to close modal
}

export function OrderForm({ onFormSubmit }: OrderFormProps) {
  const {
    addOrder,
    nextOrderSerialNumber,
    isLoading: isAppContextLoading,
  } = useAppContext();
  const [displayOrderNumber, setDisplayOrderNumber] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // The nextOrderSerialNumber from context is for display anticipation.
    // Actual order number is set by the backend.
    setDisplayOrderNumber(
      `ORDER-${String(nextOrderSerialNumber).padStart(
        3,
        "0"
      )} (Pending Confirmation)`
    );
  }, [nextOrderSerialNumber]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      vehicleNumber: "",
      partyName: "",
      referenceNumber: "",
    },
  });

  async function onSubmit(data: OrderFormValues) {
    try {
      await addOrder(data);
      toast({
        title: "Order Submitted",
        description: "The new order has been sent to the server.",
      });
      onFormSubmit(); // Close modal
      form.reset(); // Reset form for next entry
    } catch (error) {
      toast({
        title: "Error Submitting Order",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Anticipated Order Number</FormLabel>
          <Input readOnly value={displayOrderNumber} className="bg-muted" />
        </div>

        <FormField
          control={form.control}
          name="vehicleNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., MH12AB1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referenceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., PO-789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isAppContextLoading}>
          {isAppContextLoading ? "Submitting..." : "Add Order"}
        </Button>
      </form>
    </Form>
  );
}
