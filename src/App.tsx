import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TripOverview from "./pages/TripLayout";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./app/store";
import Lottie from "lottie-react";
import loadingSpinner from "./assets/animations/loading.json";
import AppLayout from "./layouts/AppLayout"; // ✅ import layout
import AddTripsPage from "./pages/AddTripsPage";
import AllTrips from "./pages/AllTrips";
import GlobalErrorModal from "./components/GlobalErrorModal";
import TripLayout from "./pages/TripLayout";
import TripActivitiesPage from "./pages/trips/TripActivitiesPage";
import TripBudgetPage from "./pages/trips/TripBudgetPage";
import TripChecklistPage from "./pages/trips/TripChecklistPage";
import TripMapPage from "./pages/trips/TripMapPage";
import TripOverviewPage from "./pages/trips/TripOverviewPage";
import TripWishlistPage from "./pages/trips/TripWishlistPage";
import { useEffect } from "react";
import { fetchCurrentUser } from "./features/auth/authThunks";

function App() {
  const loading = useSelector((state: RootState) => state.ui.loading);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, []);
  return (
    <>
      {/* Global Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-base-200/90 backdrop-blur-sm flex flex-col items-center justify-center cursor-wait select-none">
          <div className="w-28 h-28">
            <Lottie animationData={loadingSpinner} loop autoplay />
          </div>
          <p className="mt-4 text-lg text-base-content font-semibold animate-pulse">
            Loading...
          </p>
        </div>
      )}

      {/* App Routes */}
      <BrowserRouter>
        <GlobalErrorModal />

        <Routes>
          {/* ❌ No TopNavBar here */}
          <Route path="/" element={<Home />} />

          {/* ✅ Layout with TopNavBar */}
          <Route element={<AppLayout />}>
            <Route
              path="/addtrips"
              element={
                <ProtectedRoute>
                  <AddTripsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alltrips"
              element={
                <ProtectedRoute>
                  <AllTrips />
                </ProtectedRoute>
              }
            />

          </Route>
          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute>
                <TripLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TripOverviewPage />} />
            <Route path="activities" element={<TripActivitiesPage />} />
            <Route path="budget" element={<TripBudgetPage />} />
            <Route path="checklist" element={<TripChecklistPage />} />
            <Route path="wishlist" element={<TripWishlistPage />} />
            <Route path="map" element={<TripMapPage />} />
          </Route>
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
