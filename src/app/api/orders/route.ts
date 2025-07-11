
'use server';
import { NextResponse } from 'next/server';
import type { Order } from '@/lib/types';
import {connectToDatabase} from '../../lib/mongodb'
import OrderMo from "../../models/Order"
import { hasPermission } from '../../lib/checkPermission';

// import { v4 as uuidv4 } from 'uuid'; // Use if your DB doesn't auto-generate IDs or for consistency
console.log("test")
// ###################################################################################
// IMPORTANT: This is a placeholder API route.
// You need to implement the MongoDB (or other database) logic here.
// The current implementation uses an in-memory array which will reset on server restart.
// ###################################################################################

// In-memory store (for placeholder ONLY - replace with DB)
// let ordersStore: Order[] = [];
// let globalNextOrderSerial = 1;

export async function GET() {
  // TODO: Replace with MongoDB fetch logic
  // Example: const dbOrders = await db.collection('orders').find().toArray();
  await connectToDatabase()
  // const orders = await OrderMo.find();
  const orders = await OrderMo.find().sort({ inTimestamp: -1 });
  const normalizedOrders = orders.map(order => ({
  ...order.toObject(),
  id: order._id.toString(),
  }));
  // console.log(orders,"orders")
  // console.log("/api/orders GET called - DB logic needed. Returning in-memory store.");
    console.log("/api/orders GET called - fetched from DB.");

  return NextResponse.json({
  // message: "Fetched orders from in-memory store. Implement DB logic.",
      message: "Fetched orders from MongoDB.",
      orders: normalizedOrders,

  // example: ordersStore // In a real app, this would be `dbOrders`
  });
}
export async function POST(request: Request) {
  if (!await hasPermission('add_order')) {
    return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
  }
// export async function POST(request: Request) {
  try {
    const newOrderData = await request.json() as Omit<Order, 'id' | 'orderNumber' | 'status' | 'inTimestamp' | 'outTimestamp'>;

    // TODO: Replace with MongoDB insert logic
    // Example:
    // const newId = new ObjectId().toString(); // MongoDB specific ID
    // const orderNumber = `ORDER-${String(await getNextSerialFromDBAndIncrement()).padStart(3, '0')}`;
    // const fullNewOrder = {
    //   ...newOrderData,
    //   id: newId,
    //   orderNumber: orderNumber,
    //   status: 'IN' as 'IN' | 'OUT',
    //   inTimestamp: Date.now(),
    // };
    // const result = await db.collection('orders').insertOne(fullNewOrder);
    // if (!result.insertedId) throw new Error("Failed to insert order into DB");
    // return NextResponse.json({ message: "Order created in DB.", createdOrder: fullNewOrder }, { status: 201 });

    // Placeholder in-memory logic:
    // const placeholderId = `mem-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    // const placeholderOrderNumber = `ORDER-${String(globalNextOrderSerial++).padStart(3, '0')}`;

    // const createdOrder: Order = {
    //   ...newOrderData,
    //   id: placeholderId,
    //   orderNumber: placeholderOrderNumber,
    //   status: 'IN',
    //   inTimestamp: Date.now(),
    // };
    // ordersStore.unshift(createdOrder); // Add to the beginning like current app
    // console.log("/api/orders POST called. Added to in-memory store:", createdOrder);

    // return NextResponse.json({ message: "Order created (in-memory). Implement DB logic.", createdOrder: createdOrder }, { status: 201 });

    //MongoBD logic:
    await connectToDatabase();
    // Generate next order number
    const lastOrder = await OrderMo.findOne().sort({ inTimestamp: -1 });
    const lastSerial = lastOrder?.orderNumber?.split('-')[1] ?? "000";
    const nextSerial = String(Number(lastSerial) + 1).padStart(3, '0');
    const newOrderNumber = `ORDER-${nextSerial}`;

    const createdOrder = await OrderMo.create({
      ...newOrderData,
      orderNumber: newOrderNumber,
      status: 'IN',
      inTimestamp: Date.now(),
    });

    const normalizedOrder = {
    ...createdOrder.toObject(),
    id: createdOrder._id.toString(),
    };
    console.log("/api/orders POST called. Added to MongoDB:", createdOrder);

    return NextResponse.json({
      message: "Order created and stored in MongoDB.",
      createdOrder: normalizedOrder,
    }, { status: 201 });


  } catch (error) {
    console.error("Error in POST /api/orders:", error);
    return NextResponse.json({ message: "Error creating order. Check server logs.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// Helper function (placeholder) to be replaced by DB sequence logic for order numbers
// export async function getNextOrderSerialForAPI() {
//   // TODO: Fetch and increment a counter in your database
//   return globalNextOrderSerial++;
// }

// Helper function (placeholder) for resetting serial (called from settings API potentially)
export async function resetOrderSerialForAPI() {
    // TODO: Reset counter in DB
    // globalNextOrderSerial = 1;
    // ordersStore = []; // Also clear orders if reset means clearing data
    // console.log("In-memory order serial and store reset.");

    await connectToDatabase();
    await OrderMo.deleteMany({}); // Clear orders collection
    console.log("MongoDB order collection cleared. Serial will reset on next insert.");
}

