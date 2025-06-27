import { Map } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
    tripId: string;
};

function MapRedirectCard({ tripId }: Props) {
    return (
        <div className="bg-base-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Map className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Trip Map</h3>
                    <p className="text-sm text-gray-500">View your itinerary on a map</p>
                </div>
            </div>

            <Link
                to={`/trip/${tripId}/map`}
                className="btn btn-sm btn-primary self-start mt-auto"
            >
                View Map
            </Link>
        </div>
    );
}

export default MapRedirectCard;
