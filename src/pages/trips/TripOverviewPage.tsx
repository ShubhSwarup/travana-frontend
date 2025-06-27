import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTripOverview } from "../../features/trips/tripsThunk";
import { Activity } from "../../types/trips";
import { AppDispatch, RootState } from "../../app/store";

function TripOverviewPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { id: tripId } = useParams();

    const overview = useSelector(
        (state: RootState) => state.trips.selectedTripOverview
    );

    useEffect(() => {
        if (tripId) {
            dispatch(fetchTripOverview(tripId));
        }
    }, [tripId, dispatch]);

    if (!overview) return null;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-2">{overview.trip.title}</h1>
            <p className="text-gray-600">{overview.trip.destination}</p>

            <div className="mt-6">
                <h2 className="text-xl font-semibold">Activities</h2>
                <ul className="list-disc list-inside">
                    {overview.activities.map((a: Activity) => (
                        <li key={a._id}>
                            <strong>{a.name}</strong> - {a.description}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TripOverviewPage;
