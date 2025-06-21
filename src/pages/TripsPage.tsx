import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store"; // ✅ Correct types
import { fetchTrips } from "../features/trips/tripsThunk"; // ✅ Import this
import TopNavBar from "../components/TopNavBar"; // ✅ Import this
import Lottie from "lottie-react";
import emptyStateAnimation from "../assets/animations/empty-state.json";
import CreateTripModal from "../components/CreateTripModal";

export default function TripsPage() {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Use correct AppDispatch type
  const { trips, status } = useSelector((state: RootState) => state.trips);
  const hasTrips = trips.length > 0;
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200">
      <TopNavBar />

      <div className="p-6 max-w-5xl mx-auto">
        {!hasTrips && status !== "loading" ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-64 h-64">
              <Lottie animationData={emptyStateAnimation} loop={true} />
            </div>
            <h2 className="text-2xl font-semibold mt-6">
              Plan Your Next Adventure with Travana
            </h2>
            <p className="text-base-content text-sm mt-2 mb-6">
              You don’t have any trips yet. Let’s get started!
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                className="btn btn-primary"
                onClick={() => setCreateModalOpen(true)}
              >
                + New Trip
              </button>
              <button className="btn btn-accent">✨ New Trip with AI</button>
            </div>
          </div>
        ) : (
          <div>has trip</div>
        )}
      </div>
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
