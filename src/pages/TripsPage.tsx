import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store"; // ✅ Correct types
import { fetchTrips } from "../features/trips/tripsThunk"; // ✅ Import this
import TopNavBar from "../components/TopNavBar"; // ✅ Import this
import Lottie from "lottie-react";
import emptyStateAnimation from "../assets/animations/empty-state.json";

export default function TripsPage() {
 const dispatch = useDispatch<AppDispatch>(); // ✅ Use correct AppDispatch type
  const { trips, status } = useSelector((state: RootState) => state.trips);
  const hasTrips = trips.length > 0;


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
              <button className="btn btn-primary">
                + New Trip
              </button>
              <button className="btn btn-accent">
                ✨ New Trip with AI
              </button>
            </div>
            {/* <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {["Paris", "Tokyo", "Goa"].map((place) => (
                <div
                  key={place}
                  className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition"
                >
                  <img
                    src={`https://source.unsplash.com/400x300/?${place}`}
                    alt={place}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{place} Getaway</h3>
                    <p className="text-sm text-gray-500">Try planning a summer trip to {place}!</p>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        ) : (
         <div>has trip</div>
        )}
      </div>
    </div>
  );
}
