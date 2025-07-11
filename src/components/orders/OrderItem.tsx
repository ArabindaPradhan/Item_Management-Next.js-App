"use client";

import type { Order } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightToLine,
  ArrowLeftFromLine,
  Clock,
  Edit3,
  Truck,
  User,
  Hash,
  Pencil,
} from "lucide-react"; // Added ArrowLeftFromLine
import { useEffect, useState } from "react";
import { UpdateOrderModal } from "./UpdateOrderModal";

interface OrderItemProps {
  order: Order;
}

export function OrderItem({ order }: OrderItemProps) {
  const { markOrderAsOut, revertOrderToIn, updateOrder, settings } =
    useAppContext(); // Added revertOrderToIn
  const [isOverdue, setIsOverdue] = useState(false);
  const [timeInState, setTimeInState] = useState("");

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const updateOverdueStatus = () => {
      if (order.status === "IN") {
        const now = Date.now();
        const timeDiffMinutes = (now - order.inTimestamp) / (1000 * 60);

        const hours = Math.floor(timeDiffMinutes / 60);
        const minutes = Math.floor(timeDiffMinutes % 60);
        setTimeInState(`${hours}h ${minutes}m`);

        if (
          settings.maxInTimeMinutes > 0 &&
          timeDiffMinutes > settings.maxInTimeMinutes
        ) {
          setIsOverdue(true);
        } else {
          setIsOverdue(false);
        }
      } else {
        setIsOverdue(false);
        if (order.outTimestamp) {
          const timeDiffMinutes =
            (order.outTimestamp - order.inTimestamp) / (1000 * 60);
          const hours = Math.floor(timeDiffMinutes / 60);
          const minutes = Math.floor(timeDiffMinutes % 60);
          setTimeInState(`${hours}h ${minutes}m (Completed)`);
        } else {
          setTimeInState("N/A (Reverted)"); // Handle reverted state display
        }
      }
    };

    updateOverdueStatus();
    if (order.status === "IN") {
      intervalId = setInterval(updateOverdueStatus, 60000); // Update every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [order, settings.maxInTimeMinutes]);

  const inTimeDate = new Date(order.inTimestamp).toLocaleString();
  const outTimeDate = order.outTimestamp
    ? new Date(order.outTimestamp).toLocaleString()
    : "N/A";

  return (
    <Card
      className={`mb-4 shadow-lg transition-all duration-300 ease-in-out ${
        isOverdue && order.status === "IN"
          ? "border-accent ring-2 ring-accent"
          : ""
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl text-primary">
            {order.orderNumber}
          </CardTitle>
          <Badge
            variant={
              order.status === "IN"
                ? isOverdue
                  ? "destructive"
                  : "secondary"
                : "default"
            }
            className="capitalize"
          >
            {order.status}{" "}
            {isOverdue && order.status === "IN" ? "(Overdue)" : ""}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {order.status === "IN"
            ? `In since: ${inTimeDate}`
            : `Out at: ${outTimeDate}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {order.vehicleNumber && (
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-2 text-muted-foreground" />
            <strong>Vehicle:</strong>&nbsp;{order.vehicleNumber}
          </div>
        )}
        {order.partyName && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            <strong>Party:</strong>&nbsp;{order.partyName}
          </div>
        )}
        {order.referenceNumber && (
          <div className="flex items-center">
            <Hash className="w-4 h-4 mr-2 text-muted-foreground" />
            <strong>Reference:</strong>&nbsp;{order.referenceNumber}
          </div>
        )}
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>Time in System: {timeInState}</span>
        </div>
      </CardContent>
      <CardFooter>
        {order.status === "IN" && (
          <div className="flex flex-col space-y-2 w-full">
            <UpdateOrderModal order={order} onUpdate={updateOrder} />

            <Button
              onClick={() => markOrderAsOut(order.id)}
              className="w-full"
              variant="outline"
            >
              <ArrowRightToLine className="mr-2 h-4 w-4" /> Mark as OUT
            </Button>
          </div>
          // <Button onClick={() => markOrderAsOut(order.id)} className="w-full" variant="outline">
          //   <ArrowRightToLine className="mr-2 h-4 w-4" /> Mark as OUT
          // </Button>
        )}
        {order.status === "OUT" && (
          <Button
            onClick={() => revertOrderToIn(order.id)}
            className="w-full"
            variant="outline"
          >
            <ArrowLeftFromLine className="mr-2 h-4 w-4" /> Revert to IN
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
