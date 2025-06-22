import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store"; // ✅ Correct types
import {
  createTrip,
  fetchTrips,
  generateAITrip,
} from "../features/trips/tripsThunk"; // ✅ Import this
import TopNavBar from "../components/TopNavBar"; // ✅ Import this
import Lottie from "lottie-react";
import emptyStateAnimation from "../assets/animations/empty-state.json";
import CreateTripModal from "../components/CreateTripModal";
import GenerateTripModal, {
  AIGeneratedTripFormData,
} from "../components/GenerateTripModal";
import loadingSpinner from "../assets/animations/loading.json";

export default function TripsPage() {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Use correct AppDispatch type
  const { trips, status } = useSelector((state: RootState) => state.trips);
  const hasTrips = trips.length > 0;
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [isCreateAiModalOpen, setCreateAiModalOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  // 🧠 Handle AI trip generation
  const handleGenerateTrip = async (formData: AIGeneratedTripFormData) => {
    try {
      // Step 1: Generate trip with AI
      const aiRes = await dispatch(generateAITrip(formData)).unwrap();

      // Step 2: Create the trip in DB
      // await dispatch(createTrip(aiRes)).unwrap();

      // Step 3: Refresh trips
      await dispatch(fetchTrips());

      // Step 4: Close modal
      setCreateAiModalOpen(false);
    } catch (error) {
      console.error("AI trip generation failed:", error);
      // Optionally show error toast here
    }
  };

  const handleCreateTrip = async (formData: any) => {
    try {
      // Step 1: Generate trip with AI
      const aiRes = await dispatch(createTrip(formData)).unwrap();

      // Step 2: Create the trip in DB
      // await dispatch(createTrip(aiRes)).unwrap();

      // Step 3: Refresh trips
      await dispatch(fetchTrips());

      // Step 4: Close modal
      setCreateModalOpen(false);
    } catch (error) {
      console.error(" trip generation failed:", error);
      // Optionally show error toast here
    }
  };
  return (
    <div className="min-h-screen bg-base-200">
      <TopNavBar />

      <div className="p-6 max-w-5xl mx-auto">
        {/* ✅ 1. Show full-page loader while fetching */}
        {status === "loading" ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-48 h-48">
              <Lottie animationData={loadingSpinner} loop />
            </div>
            <p className="text-lg mt-4">Loading your trips...</p>
          </div>
        ) : !hasTrips ? (
          // ✅ 2. Show empty state
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-64 h-64">
              <Lottie animationData={emptyStateAnimation} loop />
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
              <button
                className="btn btn-accent"
                onClick={() => setCreateAiModalOpen(true)}
              >
                ✨ New Trip with AI
              </button>
            </div>
          </div>
        ) : (
          // ✅ 3. Show actual trip list or placeholder for now
          <div className="py-10 text-center">
            <h2 className="text-2xl font-semibold">Your Trips</h2>
            <p className="text-base-content text-sm mb-4">
              (This is where the trip cards will go)
            </p>
          </div>
        )}
      </div>

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onGenerate={handleCreateTrip}
      />

      <GenerateTripModal
        isOpen={isCreateAiModalOpen}
        onClose={() => setCreateAiModalOpen(false)}
        onGenerate={handleGenerateTrip}
      />
    </div>
  );
}
