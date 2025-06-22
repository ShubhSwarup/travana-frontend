import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import {
  createTrip,
  generateAITrip,
  fetchTrips,
  fetchTripById,
} from "../features/trips/tripsThunk";
import { useParams } from "react-router-dom";
function TripOverview() {
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams();
  const trip = useSelector((state: RootState) =>
    state.trips.trips.find((t) => t._id === id),
  );

  useEffect(() => {
    if (!trip && id) {
      dispatch(fetchTripById(id));
    }
  }, [dispatch, id, trip]);

  return <div>TripOverview</div>;
}

export default TripOverview;
