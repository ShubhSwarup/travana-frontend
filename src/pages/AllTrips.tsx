import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchTrips } from "../features/trips/tripsThunk";
import TripTabs from "../components/TripTabs";

export default function AllTripsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const trips = useSelector((state: RootState) => state.trips.trips);

  useEffect(() => {
    if (trips.length === 0) {
      dispatch(fetchTrips());
    }
  }, [dispatch, trips.length]);

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 text-primary">All Trips</h1>
        <TripTabs trips={trips} />
      </div>
    </div>
  );
}
