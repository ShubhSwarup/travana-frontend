import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TripOverview from "./pages/TripOverview";
import NotFound from "./pages/NotFound";
import Trips from "./pages/TripsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
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
  );
}

export default App;
