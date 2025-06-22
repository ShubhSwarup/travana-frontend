import React, { useEffect } from "react";
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

const AllTrips = () => {
  const trips = useSelector((state: RootState) => state.trips.trips);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (trips.length === 0) {
      dispatch(fetchTrips());
    }
    console.log(trips);
  }, [dispatch, trips.length]);

  return <div>AllTrips</div>;
};

export default AllTrips;
