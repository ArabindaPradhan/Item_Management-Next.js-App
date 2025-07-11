
'use server';
import { NextResponse } from 'next/server';
import type { AppSettings, CounterResetFrequency } from '@/lib/types';
import { resetOrderSerialForAPI } from '../orders/route'; 
import { hasPermission } from '../../lib/checkPermission';


// ###################################################################################
// IMPORTANT: This is a placeholder API route.
// You need to implement the MongoDB (or other database) logic here.
// The current implementation uses in-memory variables which will reset on server restart.
// ###################################################################################

// In-memory store (for placeholder ONLY - replace with DB)
let currentDBSettings: AppSettings = {
  maxInTimeMinutes: 60,
  counterResetFrequency: 'daily',
  lastResetTimestamp: Date.now(),
};
let currentDBNextOrderSerial = 1; // Corresponds to globalNextOrderSerial in orders/route.ts

export async function GET() {
  // TODO: Replace with MongoDB fetch logic for settings and next serial number
  // Example:
  // const dbSettings = await db.collection('settings').findOne({}); // Assuming one settings document
  // const dbNextSerial = await db.collection('counters').findOne({ _id: 'orderSerial' }); // Or derive it
  // if (!dbSettings) { /* handle first time setup */ }
  // return NextResponse.json({ settings: dbSettings, nextOrderSerialNumber: dbNextSerial?.value || 1 });

  console.log("/api/settings GET called - DB logic needed. Returning in-memory settings.");
  // To keep placeholder consistent, read the serial from the orders API's conceptual store
  // currentDBNextOrderSerial = getNextOrderSerialForAPI(); // This won't work directly, placeholder for concept

  return NextResponse.json({
    message: "Fetched settings from in-memory store. Implement DB logic.",
    settings: currentDBSettings,
    nextOrderSerialNumber: currentDBNextOrderSerial // This should be the *next available* serial
  });
}

export async function POST(request: Request) {
  if (!await hasPermission('settings')) {
    return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
  }
  try {
    const { settings: newSettingsData, resetCounter } = await request.json() as { settings: Partial<AppSettings>, resetCounter?: boolean };

    // TODO: Replace with MongoDB update/insert logic
    // Example:
    // const updatedSettings = { ...currentDBSettingsFromDB, ...newSettingsData };
    // if (resetCounter) {
    //   updatedSettings.lastResetTimestamp = Date.now();
    //   await db.collection('counters').updateOne({ _id: 'orderSerial' }, { $set: { value: 1 } }, { upsert: true });
    //   currentDBNextOrderSerial = 1;
    //   // Potentially clear orders collection if reset implies data wipe:
    //   // await db.collection('orders').deleteMany({});
    // }
    // await db.collection('settings').updateOne({}, { $set: updatedSettings }, { upsert: true });
    // return NextResponse.json({ settings: updatedSettings, nextOrderSerialNumber: currentDBNextOrderSerial });

    // Placeholder in-memory logic:
    currentDBSettings = { ...currentDBSettings, ...newSettingsData };
    let finalSerial = currentDBNextOrderSerial;

    if (resetCounter) {
      console.log("/api/settings POST: resetCounter signal received. Resetting in-memory serial and timestamp.");
      currentDBSettings.lastResetTimestamp = Date.now();
      resetOrderSerialForAPI(); // Calls the function in orders/route to reset its in-memory store
      currentDBNextOrderSerial = 1; // Reset local track for settings API
      finalSerial = 1;
    }
    console.log("/api/settings POST called. Updated in-memory settings:", currentDBSettings, "Next serial:", finalSerial);

    return NextResponse.json({
      message: "Settings updated (in-memory). Implement DB logic.",
      settings: currentDBSettings,
      nextOrderSerialNumber: finalSerial
    });

  } catch (error) {
    console.error("Error in POST /api/settings:", error);
    return NextResponse.json({ message: "Error updating settings. Check server logs.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
