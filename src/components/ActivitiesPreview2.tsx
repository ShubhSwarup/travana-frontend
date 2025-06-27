import { MapPin, CalendarDays } from "lucide-react";
import { Activity } from "../types/trips";
import { Link } from "react-router-dom";

type Props = {
    activities: Activity[];
    tripId: string;
};

function ActivitiesPreview2({ activities, tripId }: Props) {
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
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Upcoming Activities</h2>
                <Link
                    to={`/trip/${tripId}/activities`}
                    className="text-sm text-primary hover:underline"
                >
                    View All
                </Link>
            </div>

            <ul className="space-y-3">
                {activities.map((activity) => (
                    <li
                        key={activity._id}
                        className="bg-base-100 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow"
                    >
                        <div className="mb-2 sm:mb-0 w-full sm:w-1/2">
                            <div className="tooltip tooltip-bottom w-full" data-tip={activity.name}>
                                <h3 className="font-medium text-base truncate max-w-full">
                                    {activity.name}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1 truncate max-w-full">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span className="truncate">{activity.location}</span>
                            </p>
                        </div>

                        <p className="text-sm text-gray-400 flex items-center gap-1 shrink-0 mt-1 sm:mt-0">
                            <CalendarDays className="w-4 h-4" />
                            {new Date(activity.time).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActivitiesPreview2;
