import { Map } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
    tripId: string;
};

function MapRedirectCard({ tripId }: Props) {
    return (
        <div className="bg-base-200 rounded-xl p-4 shadow-sm w-full transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Map className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Trip Map</h3>
                    <p className="text-sm text-gray-500">View your itinerary on a map</p>
                </div>
            </div>

            {/* Image */}
            <div className="mb-4">
                <img
                    src="/images/map2.png"
                    alt="Trip Map Preview"
                    className="rounded-lg w-full h-60 object-cover"
                />
            </div>

            {/* Button */}
            <Link
                to={`/trip/${tripId}/map`}
                className="btn btn-sm btn-primary"
            >
                View Map
            </Link>
        </div>
    );
}

export default MapRedirectCard;
