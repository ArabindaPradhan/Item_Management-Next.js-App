"use client";

import type { Order } from '@/lib/types';
import { OrderItem } from './OrderItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderListProps {
  orders: Order[];
  title: string;
}

export function OrderList({ orders, title }: OrderListProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-headline font-semibold mb-4 text-primary">{title}</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">No orders in this category.</p>
      ) : (
        <ScrollArea className="flex-grow pr-3 -mr-3"> {/* Negative margin to hide scrollbar track, pr to give space to content */}
          <div className="space-y-4">
            {orders.map(order => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
