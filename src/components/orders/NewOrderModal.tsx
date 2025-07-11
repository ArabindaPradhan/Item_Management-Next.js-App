"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderForm } from "./OrderForm";
import { PlusCircle } from "lucide-react";

export interface NewOrderModalRef {
  open: () => void;
}

export const NewOrderModal = forwardRef<NewOrderModalRef>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Order</DialogTitle>
          <DialogDescription>
            Fill in the details for the new material order. The order number is
            auto-generated.
          </DialogDescription>
        </DialogHeader>
        <OrderForm onFormSubmit={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
});

NewOrderModal.displayName = "NewOrderModal";
