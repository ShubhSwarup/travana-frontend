// src/layouts/TripLayout.tsx
import { Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../app/store";
import { fetchTripById } from "../features/trips/tripsThunk";
import SideNavBar from "../components/SideNavBar";

function TripLayout() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [collapsed, setCollapsed] = useState(false);
  const trip = useSelector((state: RootState) =>
    state.trips.trips.find((t) => t._id === id)
  );

  useEffect(() => {
    if (!trip && id) {
      dispatch(fetchTripById(id));
    }
  }, [dispatch, id, trip]);

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-40 overflow-y-auto">
        <SideNavBar tripId={id!} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Dynamic margin depending on collapsed state */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-72"} overflow-y-auto`}>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );

}

export default TripLayout;
