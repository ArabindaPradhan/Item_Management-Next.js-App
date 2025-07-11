export interface Order {
  id: string;
  orderNumber: string; // e.g., "ORDER-001"
  vehicleNumber?: string;
  partyName?: string;
  referenceNumber?: string;
  status: 'IN' | 'OUT';
  inTimestamp: number;
  outTimestamp?: number;
}

export type CounterResetFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export interface AppSettings {
  maxInTimeMinutes: number;
  counterResetFrequency: CounterResetFrequency;
  lastResetTimestamp: number; 
}
