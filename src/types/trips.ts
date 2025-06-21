// Trip interface
export type Trip = {
  _id: string;
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
};

export interface TripState {
  trips: Trip[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
