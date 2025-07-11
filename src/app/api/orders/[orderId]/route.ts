
'use server';
import { NextRequest, NextResponse } from 'next/server';
import type { Order } from '@/lib/types';
import { connectToDatabase } from '../../../lib/mongodb';
import OrderMo from '../../../models/Order';
import { hasPermission } from '../../../lib/checkPermission';


// ###################################################################################
// IMPORTANT: This is a placeholder API route.
// You need to implement the MongoDB (or other database) logic here.
// The current implementation uses an in-memory array which will reset on server restart
// and might not be consistent with the one in /api/orders/route.ts without a shared DB.
// ###################################################################################

// Accessing ordersStore from the other route file directly won't work reliably in serverless.
// This is a major reason to use a proper database.
// For placeholder, we'll log this limitation.
// import { ordersStore } from '../route'; // This kind of import for shared mutable state is problematic.

// export async function PUT(request: Request, { params }: { params: { orderId: string } }) {
export async function PUT(request: NextRequest, context: { params: { orderId: string } }){

  const body = await request.json();
  const isOutAction = body.status === 'OUT';
  const isRevertAction = body.status === 'IN';

  if (isOutAction && !await hasPermission('mark_out')) {
    return NextResponse.json({ message: 'Permission denied for mark_out' }, { status: 403 });
  }
  if (isRevertAction && !await hasPermission('revert_in')) {
    return NextResponse.json({ message: 'Permission denied for revert_in' }, { status: 403 });
  }
  if (!isOutAction && !isRevertAction && !await hasPermission('update_order')) {
    return NextResponse.json({ message: 'Permission denied for update_order' }, { status: 403 });
  }

  // const { orderId } = params;
  const { params } = context;
  const orderId = (await params).orderId; 

  if (!orderId) {
    return NextResponse.json({ message: "Missing orderId in URL." }, { status: 400 });
  }

  try {
    // const updatedFields = await request.json() as Partial<Order>;

    // TODO: Implement MongoDB logic to update the order by ID
    // Example:
    // const result = await db.collection('orders').findOneAndUpdate(
    //   { id: orderId }, // or { _id: new ObjectId(orderId) } if using MongoDB ObjectIds
    //   { $set: updatedFields },
    //   { returnDocument: 'after' }
    // );
    // if (!result.value) {
    //   return NextResponse.json({ message: "Order not found in DB" }, { status: 404 });
    // }
    // return NextResponse.json({ message: "Order updated in DB.", updatedOrder: result.value });

    await connectToDatabase();

    const updatedOrder = await OrderMo.findByIdAndUpdate(
      orderId,
      { $set: body },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { message: `Order with ID ${orderId} not found.` },
        { status: 404 }
      );
    }
    const normalizedOrder = {
    ...updatedOrder.toObject(),
    id: updatedOrder._id.toString(),
    };

    // console.warn("PUT /api/orders/[orderId]: Using in-memory store. Data consistency across API routes not guaranteed without a DB.");
    // Placeholder in-memory logic (highly simplified and likely inconsistent):
    // This requires `ordersStore` to be accessible and modifiable here.
    // Let's assume for placeholder purposes that ordersStore is magically available.
    // A proper solution would require fetching from ../route.ts's ordersStore or a DB.
    // For now, we will simulate this by acting on a conceptual shared store.

    // This part is problematic for in-memory store shared across route files.
    // We'll return a conceptual updated order.
    // const orderIndex = ordersStore.findIndex(o => o.id === orderId);
    // if (orderIndex > -1) {
    //   ordersStore[orderIndex] = { ...ordersStore[orderIndex], ...updatedFields };
    //   console.log(`/api/orders/${orderId} PUT. Updated in-memory store (conceptual):`, ordersStore[orderIndex]);
    //   return NextResponse.json({ message: `Order updated (in-memory). Implement DB logic.`, updatedOrder: ordersStore[orderIndex] });
    // }

    // console.log(`/api/orders/${orderId} PUT called with:`, updatedFields, "- DB logic needed.");
    // const placeholderUpdatedOrder = { // Simulate finding and merging
    //   id: orderId,
    //   // ... original order fields would be here ...
    //   ...updatedFields,
    // };

    console.log(`/api/orders/${orderId} PUT called - updated in DB:`, updatedOrder);

    return NextResponse.json({
      // message: `PUT /api/orders/${orderId} (in-memory simulation). Implement DB logic.`,
      // updatedOrder: placeholderUpdatedOrder

      message: `Order ${orderId} updated successfully in MongoDB.`,
      updatedOrder: normalizedOrder,
    });

  } catch (error) {
    console.error(`Error in PUT /api/orders/${orderId}:`, error);
    return NextResponse.json({ message: `Error updating order ${orderId}. Check server logs.`, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
