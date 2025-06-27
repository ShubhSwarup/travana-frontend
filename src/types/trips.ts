// Trip interface
// export type Trip = {
//   _id: string;
//   title: string;
//   origin: string;
//   destination: string;
//   startDate: string;
//   endDate: string;
//   createdAt?: string;
// };

export interface TripState {
  trips: Trip[]; // just basic trip info
  selectedTripOverview: TripOverview | null; // detailed overview
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// src/types/tripTabs.ts

// ========== Common ==========
export type MongoId = string;

// ========== Activity ==========
export interface Activity {
  _id: MongoId;
  trip: MongoId;
  name: string;
  description: string;
  location: string;
  time: string; // ISO format
  category: string;
  expense: MongoId | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ========== Expense ==========
export interface Expense {
  _id: MongoId;
  trip: MongoId;
  activity: MongoId | null;
  title: string;
  amount: number;
  category: string;
  notes: string;
  date: string; // ISO format
  generatedByAI: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ========== Checklist ==========
export interface ChecklistItem {
  _id: MongoId;
  trip: MongoId;
  type: string; // e.g., 'packing', 'task', etc.
  text: string;
  completed: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ========== Wishlist ==========
export interface WishlistItem {
  _id: MongoId;
  user: MongoId;
  trip: MongoId;
  title: string;
  type: string; // e.g., 'food', 'activity', etc.
  notes: string;
  visited: boolean;
  location: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ========== Trip ==========
export interface Trip {
  _id: MongoId;
  user: MongoId;
  title: string;
  destination: string;
  description: string;
  startDate: string; // ISO
  endDate: string; // ISO
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ========== Overview Response ==========
export interface TripOverview {
  trip: Trip;
  activities: Activity[];
  expenses: Expense[];
  wishlist: WishlistItem[];
  bookings: any[]; // TODO: Define later
  checklistItems: ChecklistItem[];
}
