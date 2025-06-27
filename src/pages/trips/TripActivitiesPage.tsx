import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchActivities } from "../../features/activities/activitiesThunk";
import { categoryIcons } from "../../utils/iconMapper";
import useMediaQuery from "../../hooks/useMediaQuery";

const ActivitiesTab = () => {
    const { id: tripId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { activities } = useSelector((state: RootState) => state.activities);
    const [view, setView] = useState<'list' | 'card' | 'accordion'>('list');
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        if (tripId) dispatch(fetchActivities(tripId));
    }, [tripId, dispatch]);

    return (
        <div className="p-4 max-w-screen-xl mx-auto lg:h-[calc(100vh-4rem)]">
            <div className="flex flex-col lg:grid lg:grid-cols-[220px_1fr_240px] gap-6 lg:h-full">

                {/* Left Sidebar */}
                <aside className="space-y-4 w-full lg:w-auto">
                    <div className="text-sm font-medium">Filters</div>
                    <select className="select select-sm w-full">
                        <option>All Categories</option>
                        <option>Sightseeing</option>
                        <option>Food</option>
                        <option>Shopping</option>
                    </select>
                    <select className="select select-sm w-full">
                        <option>Sort by Date</option>
                        <option>Sort by Time</option>
                    </select>
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-2">
                            <input type="checkbox" className="checkbox checkbox-primary" />
                            <span className="label-text">Upcoming Only</span>
                        </label>
                    </div>
                </aside>

                {/* Center Activities Section */}
                <main className="flex flex-col space-y-4 lg:overflow-hidden w-full">
                    {/* View Toggle */}
                    <div className="flex gap-2">
                        {['list', 'card', 'accordion'].map((v) => (
                            <button
                                key={v}
                                className={`btn btn-sm btn-outline ${view === v ? 'btn-primary' : ''}`}
                                onClick={() => setView(v as typeof view)}
                            >
                                {v === 'list' ? '📋 List' : v === 'card' ? '📦 Card' : '🪄 Accordion'}
                            </button>
                        ))}
                    </div>

                    {/* Sticky Day Tabs */}
                    <div className="overflow-x-auto flex gap-2 pb-2 border-b">
                        {["Day 1", "Day 2", "Day 3", "Day 4"].map((d, i) => (
                            <button key={i} className="btn btn-xs btn-outline rounded-full">
                                {d}
                            </button>
                        ))}
                    </div>

                    {/* Activities Content */}
                    <div className="lg:overflow-y-auto lg:pr-2 lg:flex-1">
                        {view === 'list' && (
                            <ul className="space-y-3">
                                {activities.map((activity) => {
                                    const Icon = categoryIcons[activity.category] || categoryIcons["location"];
                                    return (
                                        <li
                                            key={activity._id}
                                            className="bg-base-100 rounded-xl p-4 shadow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3"
                                        >
                                            <div className="flex gap-3 items-start w-full">
                                                <div className="bg-primary/10 p-2 rounded-full">{Icon()}</div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base truncate">{activity.name}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                                        <MapPin className="w-4 h-4" /> {activity.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 flex items-center gap-1 sm:whitespace-nowrap">
                                                <CalendarDays className="w-4 h-4" />
                                                {new Date(activity.time).toLocaleDateString()}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {view === 'card' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activities.map((activity) => (
                                    <div key={activity._id} className="card bg-base-100 p-4 shadow rounded-xl">
                                        <h3 className="font-semibold text-lg mb-1">{activity.name}</h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <CalendarDays className="w-4 h-4 inline" /> {new Date(activity.time).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <MapPin className="w-4 h-4 inline" /> {activity.location}
                                        </p>
                                        <div className="badge badge-primary">{activity.category}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === 'accordion' && (
                            <div className="space-y-2">
                                {activities.map((activity) => (
                                    <div key={activity._id} className="collapse collapse-arrow bg-base-100 shadow rounded-xl">
                                        <input type="checkbox" />
                                        <div className="collapse-title font-medium flex justify-between">
                                            {activity.name} <span className="text-sm text-gray-500">{new Date(activity.time).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="collapse-content text-sm text-gray-500">
                                            <p>📍 {activity.location}</p>
                                            <p>📌 Category: {activity.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="space-y-4 w-full lg:w-auto">
                    <div className="bg-base-100 p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-2">Quick Summary</h3>
                        <p className="text-sm">You're spending ₹4,200 today.</p>
                        <p className="text-sm">Next activity in 2 hours.</p>
                    </div>
                    <div className="bg-base-100 p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-2">Suggestions</h3>
                        <p className="text-sm">No dinner plan yet? Add one!</p>
                    </div>
                </aside>
            </div>

            {/* Floating Add Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="dropdown dropdown-top dropdown-end">
                    <label tabIndex={0} className="btn btn-primary btn-circle btn-lg">
                        <Plus className="w-5 h-5" />
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                        <li><a>Add Activity</a></li>
                        <li><a>Add Expense</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ActivitiesTab;
