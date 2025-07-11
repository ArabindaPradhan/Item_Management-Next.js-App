"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";
import { OrderList } from "@/components/orders/OrderList";
import { NewOrderModal } from "@/components/orders/NewOrderModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAuthResolved, logout } = useAuth();
  const { orders, isLoading, error } = useAppContext();

  useEffect(() => {
    if (isAuthResolved && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthResolved, router]);

  if (!isAuthResolved) {
    return null; // Prevent redirect/render until auth check completes
  }

  if (isLoading && !orders.length) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>
          There was an issue fetching data from the server: {error}. Please try
          again later. If the issue persists, ensure the backend API is running
          and configured correctly.
        </AlertDescription>
      </Alert>
    );
  }

  const inOrders = orders
    .filter((order) => order.status === "IN")
    .sort((a, b) => b.inTimestamp - a.inTimestamp);

  const outOrders = orders
    .filter((order) => order.status === "OUT")
    .sort((a, b) => (b.outTimestamp ?? 0) - (a.outTimestamp ?? 0));

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] px-4 md:px-6 overflow-x-hidden">
      <div className="mb-6 flex justify-between items-center">
        <NewOrderModal />
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto pr-2">
          <OrderList orders={inOrders} title="Pending Orders (IN)" />
        </div>
        <div className="h-full overflow-y-auto pr-2 mt-8 md:mt-0">
          <OrderList orders={outOrders} title="Completed Orders (OUT)" />
        </div>
      </div>

      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-secondary text-secondary-foreground p-3 rounded-md shadow-lg">
          Loading...
        </div>
      )}
    </div>
  );
}
