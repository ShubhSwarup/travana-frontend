import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTripOverview } from "../../features/trips/tripsThunk";
import { Activity } from "../../types/trips";
import { AppDispatch, RootState } from "../../app/store";
import HeroSection from "../../components/TripHeroSection";
import ActivitiesPreview from "../../components/ActivitiesPreview";
import ActivitiesPreview2 from "../../components/ActivitiesPreview2";
import ExpensesPreview from "./ExpensesPreview";
import MapRedirectCard from "./MapRedirectCard";
import { Plus } from "lucide-react";
// import ActivitiesPreview from "../../components/ActivitiesPreview2";

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
    }, [tripId]);

    if (!overview) return null;

    return (
        <div className="p-4">
            <HeroSection trip={overview.trip} />
            {/* <ActivitiesPreview2 activities={overview.activities} tripId={tripId!} /> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">

                <ActivitiesPreview activities={overview.activities} tripId={tripId!} />
                <ExpensesPreview expenses={overview.expenses} tripId={tripId!} />
                <MapRedirectCard tripId={tripId!} />

                {/* Add WishlistPreview, ChecklistPreview, etc. here as more come in */}
            </div>
            <div className="fixed bottom-6 right-6 z-50">
                <div className="dropdown dropdown-top dropdown-end">
                    <label tabIndex={0} className="btn btn-primary btn-circle btn-lg">
                        <Plus className="w-5 h-5" />
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                    >
                        <li>
                            <a>Add Expense</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TripOverviewPage;
