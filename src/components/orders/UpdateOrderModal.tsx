"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { Order } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const updateOrderSchema = z.object({
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

type UpdateOrderValues = z.infer<typeof updateOrderSchema>;

interface UpdateOrderModalProps {
  order: Order;
  onUpdate: (orderId: string, updatedData: Partial<Order>) => Promise<void>;
}

export function UpdateOrderModal({ order, onUpdate }: UpdateOrderModalProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateOrderValues>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      vehicleNumber: order.vehicleNumber || "",
      partyName: order.partyName || "",
      referenceNumber: order.referenceNumber || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UpdateOrderValues) => {
    setIsSubmitting(true);
    try {
      await onUpdate(order.id, data);
      setOpen(false);
    } catch (err) {
      console.error("Failed to update", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full"
        variant="default"
      >
        Update Order
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Vehicle Number" {...field} />
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
                    <FormLabel>Party Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Party Name" {...field} />
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
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Reference Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
