import useMediaQuery from "../hooks/useMediaQuery"; // or wherever you put it
import { MapPin, CalendarDays } from "lucide-react";
import { Activity } from "../types/trips";
import { Link } from "react-router-dom";
import { categoryIcons } from "../utils/iconMapper";

type Props = {
    activities: Activity[];
    tripId: string;
};

function ActivitiesPreview({ activities, tripId }: Props) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (!activities || activities.length === 0) {
        return (
            <div className="bg-base-200 rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Upcoming Activities</h2>
                <p className="text-sm text-gray-500">No upcoming activities yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-base-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Upcoming Activities</h2>
                <Link
                    to={`/trip/${tripId}/activities`}
                    className="text-sm text-primary hover:underline"
                >
                    View All
                </Link>
            </div>

            {/* Mobile view: icons + name below */}
            {isMobile ? (
                <div className="grid grid-cols-2 gap-3">
                    {activities.map((activity) => {
                        const Icon = categoryIcons[activity.category] || MapPin;
                        return (
                            <div
                                key={activity._id}
                                className="flex flex-col items-center text-center px-2"
                            >
                                <div className="tooltip tooltip-bottom" data-tip={activity.name}>
                                    <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto"><Icon className="w-5 h-5 text-primary" /></div>
                                </div>
                                <p className="text-sm mt-1 w-full line-clamp-2">{activity.name}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Desktop view
                <ul className="flex flex-col gap-3">
                    {activities.map((activity) => {
                        const Icon = categoryIcons[activity.category] || MapPin;
                        return (
                            <li
                                key={activity._id}
                                className="bg-base-100 rounded-lg p-3 flex items-start justify-between gap-4 shadow-sm"
                            >
                                {/* Left Part */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="bg-primary/10 p-2 rounded-full shrink-0"> <Icon className="w-5 h-5 text-primary" /></div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-base truncate">{activity.name}</h3>
                                        <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 truncate">
                                            <MapPin className="w-4 h-4" />
                                            {activity.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Part */}
                                <p className="text-xs md:text-sm text-gray-400 flex items-center gap-1 whitespace-nowrap">
                                    <CalendarDays className="w-4 h-4" />
                                    {new Date(activity.time).toLocaleDateString()}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default ActivitiesPreview;
