import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TripOverview from "./pages/TripOverview";
import NotFound from "./pages/NotFound";
import Trips from "./pages/TripsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import Lottie from "lottie-react";
import loadingSpinner from "./assets/animations/loading.json";

function App() {
  const loading = useSelector((state: RootState) => state.ui.loading);

  return (
    <>
      {/* Global Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-base-200/70 flex justify-center items-center">
          <div className="w-32 h-32">
            <Lottie animationData={loadingSpinner} loop />
          </div>
        </div>
      )}

      {/* App Routes */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route path="/trip/:id" element={<TripOverview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
