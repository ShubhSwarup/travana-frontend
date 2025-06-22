import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import {
  createTrip,
  generateAITrip,
  fetchTrips,
} from "../features/trips/tripsThunk";
import Lottie from "lottie-react";
import emptyStateAnimation from "../assets/animations/empty-state.json";
import CreateTripModal from "../components/CreateTripModal";
import GenerateTripModal, {
  AIGeneratedTripFormData,
} from "../components/GenerateTripModal";
import loadingSpinner from "../assets/animations/loading.json";
import { useNavigate } from "react-router-dom";
export default function AddTripsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreateAiModalOpen, setCreateAiModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleGenerateTrip = async (formData: AIGeneratedTripFormData) => {
    try {
      // await dispatch(fetchTrips());
      const trip = await dispatch(generateAITrip(formData)).unwrap();
      setCreateAiModalOpen(false);
      navigate(`/trip/${trip._id}`);
    } catch (error) {
      console.error("AI trip generation failed:", error);
    }
  };

  const handleCreateTrip = async (formData: any) => {
    try {
      // await dispatch(createTrip(formData)).unwrap();
      // await dispatch(fetchTrips());
      const trip = await dispatch(createTrip(formData)).unwrap();
      setCreateModalOpen(false);
      navigate(`/trip/${trip._id}`);
    } catch (error) {
      console.error("Trip creation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-64 h-64">
            <Lottie animationData={emptyStateAnimation} loop />
          </div>
          <h2 className="text-2xl font-semibold mt-6">
            Plan Your Next Adventure with Travana
          </h2>
          <p className="text-base-content text-sm mt-2 mb-6">
            Let’s add a trip to get started!
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
