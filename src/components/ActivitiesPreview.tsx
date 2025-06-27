import { MapPin, CalendarDays } from "lucide-react";
import { Activity } from "../types/trips";
import { Link } from "react-router-dom";
import { categoryIcons } from "../utils/iconMapper";

type Props = {
    activities: Activity[];
    tripId: string;
};

function ActivitiesPreview({ activities, tripId }: Props) {
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

            {/* ✅ Mobile View: icon only */}
            <div className="grid grid-cols-2 gap-3 sm:hidden">
                {activities.map((activity) => {
                    const Icon = categoryIcons[activity.category] || categoryIcons["location"];
                    return (
                        <div
                            key={activity._id}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="tooltip tooltip-bottom" data-tip={activity.name}>
                                <div className="bg-primary/10 p-4 rounded-full">{Icon()}</div>
                            </div>
                            <p className="text-sm mt-1 truncate w-full">{activity.name}</p>
                        </div>
                    );
                })}
            </div>

            {/* ✅ Desktop View: row cards */}
            <ul className="hidden sm:flex sm:flex-col sm:gap-3">
                {activities.map((activity) => {
                    const Icon = categoryIcons[activity.category] || categoryIcons["location"];
                    return (
                        <li
                            key={activity._id}
                            className="min-h-[72px] bg-base-100 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow"
                        >

                            <div className="flex items-start gap-3 w-full sm:w-1/2">
                                <div className="bg-primary/10 p-2 rounded-full shrink-0">{Icon()}</div>
                                <div className="tooltip tooltip-bottom w-full" data-tip={activity.name}>
                                    <h3 className="font-medium text-base truncate">{activity.name}</h3>
                                    {/* <p className="text-sm text-gray-500 flex items-center gap-1 truncate"> */}
                                    <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 truncate">

                                        <MapPin className="w-4 h-4" />
                                        {activity.location}
                                    </p>
                                </div>
                            </div>
                            {/* <p className="text-sm text-gray-400 flex items-center gap-1 mt-2 sm:mt-0 sm:ml-4"> */}
                            <p className="text-xs md:text-xs text-gray-400 flex items-center gap-1 mt-2 sm:mt-0 sm:ml-4">

                                <CalendarDays className="w-4 h-4" />
                                {new Date(activity.time).toLocaleDateString()}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default ActivitiesPreview;
