// src/layouts/TripLayout.tsx
import { Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../app/store";
import { fetchTripById } from "../features/trips/tripsThunk";
import SideNavBar from "../components/SideNavBar";

function TripLayout() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const trip = useSelector((state: RootState) =>
    state.trips.trips.find((t) => t._id === id)
  );

  useEffect(() => {
    if (!trip && id) {
      dispatch(fetchTripById(id));
    }
  }, [dispatch, id, trip]);

  return (
    <div className="drawer drawer-open">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <SideNavBar tripId={id!} />
      </div>
    </div>



  );
}

export default TripLayout;
