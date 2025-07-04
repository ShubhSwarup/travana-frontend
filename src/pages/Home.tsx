import React from "react";
import HeroSection from "../components/HeroSection";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchTrips } from "../features/trips/tripsThunk";

// If user is logged in and visits /, they’re redirected based on trips.
// If user is not logged in, the login/signup UI shows.
function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const authToken = useSelector((state: RootState) => state.auth.token); // adjust if your token is in a different key
  const { trips } = useSelector((state: RootState) => state.trips);

  useEffect(() => {
    if (authToken) {
      dispatch(fetchTrips()).then((res: any) => {
        const fetchedTrips = res.payload || [];
        if (fetchedTrips.length === 0) {
          navigate("/addtrips");
        } else if (fetchedTrips.length === 1) {
          navigate(`/trip/${fetchedTrips[0]._id}/`);
        } else {
          navigate("/alltrips");
        }
      });
    }
  }, []);

  if (authToken && trips.length > 0) {
    return null;
  }

  return <HeroSection></HeroSection>;
}

export default Home;
