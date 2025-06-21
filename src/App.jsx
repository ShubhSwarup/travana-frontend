import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TripOverview from "./pages/TripOverview";
import NotFound from "./pages/NotFound";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip/:id" element={<TripOverview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
