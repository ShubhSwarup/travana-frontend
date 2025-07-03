import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Plus, Pencil } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchActivities } from "../../features/activities/activitiesThunk";
import { categoryIcons } from "../../utils/iconMapper";
import useMediaQuery from "../../hooks/useMediaQuery";
import { ACTIVITY_CATEGORIES, ACTIVITY_SORT_OPTIONS } from "../../utils/constants";
import ActivityFormModal, { ActivityFormValues } from "../../components/ActivityFormModal";

const ActivitiesTab = () => {
    const { id: tripId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { activities } = useSelector((state: RootState) => state.activities);
    const [view, setView] = useState<'list' | 'card' | 'accordion'>('list');
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [sortOption, setSortOption] = useState("date-asc");
    const [upcomingOnly, setUpcomingOnly] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activityToEdit, setActivityToEdit] = useState<ActivityFormValues | null>(null);

    useEffect(() => {
        if (tripId) dispatch(fetchActivities(tripId));
    }, [tripId, dispatch]);



    const now = new Date().getTime();

    const sortedAllActivities = [...activities].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    const tripStartDate = sortedAllActivities.length > 0 ? new Date(sortedAllActivities[0].time) : null;

    // Filter for upcoming if needed
    const baseActivities = activities.filter((activity) => {
        if (upcomingOnly && new Date(activity.time).getTime() < now) {
            return false;
        }
        return true;
    });

    const dayMap: Record<string, typeof activities> = {};

    baseActivities.forEach((activity) => {
        const activityDate = new Date(activity.time);
        const dayDiff = tripStartDate
            ? Math.floor((activityDate.getTime() - tripStartDate.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
        const dayLabel = `Day ${dayDiff + 1}`;
        if (!dayMap[dayLabel]) dayMap[dayLabel] = [];
        dayMap[dayLabel].push(activity);
    });

    const dayTabs = Object.keys(dayMap).sort((a, b) => {
        const numA = parseInt(a.split(" ")[1]);
        const numB = parseInt(b.split(" ")[1]);
        return numA - numB;
    });



    const filteredActivities = baseActivities
        .filter((activity) => {
            // Filter by selected day (if any)
            if (selectedDay) {
                const activityDate = new Date(activity.time);
                const dayDiff = tripStartDate
                    ? Math.floor((activityDate.getTime() - tripStartDate.getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                const dayLabel = `Day ${dayDiff + 1}`;
                if (dayLabel !== selectedDay) return false;
            }

            // Filter by category
            if (
                selectedCategory !== "All Categories" &&
                activity.category.toLowerCase() !== selectedCategory.toLowerCase()
            ) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            const aDate = new Date(a.time).getTime();
            const bDate = new Date(b.time).getTime();

            switch (sortOption) {
                case "date-asc":
                case "time-asc":
                    return aDate - bDate;
                case "date-desc":
                case "time-desc":
                    return bDate - aDate;
                default:
                    return 0;
            }
        });

    const isToday = (date: Date) => {
        const now = new Date();
        return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    };

    const nowDate = new Date();

    // Total expense for today
    const todayExpense = filteredActivities.reduce((sum, activity) => {
        const time = new Date(activity.time);
        if (isToday(time) && typeof activity.expense === "number") {
            return sum + activity.expense;
        }

        return sum;
    }, 0);

    // Next upcoming activity
    const futureActivities = filteredActivities
        .filter((a) => new Date(a.time).getTime() > nowDate.getTime())
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const nextActivity = futureActivities[0];
    let timeUntilNext = "";

    if (nextActivity) {
        const diff = new Date(nextActivity.time).getTime() - nowDate.getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        timeUntilNext =
            hours > 0 ? `${hours}h ${mins}m` : mins > 0 ? `${mins}m` : "Now";
    }

    const suggestions: string[] = [];

    const hasDinner = filteredActivities.some(
        (a) =>
            a.category === "food" &&
            new Date(a.time).getHours() >= 19 && // 7 PM onwards
            isToday(new Date(a.time))
    );

    const hasShopping = activities.some((a) => a.category === "shopping");
    const hasStay = activities.some((a) => a.category === "stay");
    const hasTodayActivities = filteredActivities.some((a) => isToday(new Date(a.time)));

    if (!hasTodayActivities) suggestions.push("You have a free day today. Add something fun!");
    if (!hasDinner) suggestions.push("No dinner plan yet? Add one!");
    if (!hasShopping) suggestions.push("No shopping planned yet. Want to explore local markets?");
    if (!hasStay) suggestions.push("Don’t forget to add your stay/hotel info!");
    if (activities.length < 3) suggestions.push("Plan more activities to make the most of your trip!");


    return (
        <div className="p-4 max-w-screen-xl mx-auto lg:h-[calc(100vh-4rem)]">
            <div className="flex flex-col lg:grid lg:grid-cols-[220px_1fr_240px] gap-6 lg:h-full">

                {/* Left Sidebar */}
                <aside className="space-y-4 w-full lg:w-auto">
                    <div className="text-sm font-medium">Filters</div>
                    <select
                        className="select select-sm w-full"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {ACTIVITY_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        className="select select-sm w-full"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        {ACTIVITY_SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-2">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                checked={upcomingOnly}
                                onChange={(e) => setUpcomingOnly(e.target.checked)}
                            />
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
                        {dayTabs.map((day) => (
                            <button
                                key={day}
                                className={`btn btn-xs rounded-full ${selectedDay === day ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setSelectedDay(selectedDay === day ? null : day)} // toggle logic
                            >
                                {day}
                            </button>
                        ))}

                    </div>

                    {/* Activities Content */}
                    <div className="lg:overflow-y-auto lg:pr-2 lg:flex-1">
                        {view === 'list' && (
                            <ul className="space-y-3">
                                {filteredActivities.map((activity) => {
                                    const Icon = categoryIcons[activity.category] || categoryIcons["location"];
                                    return (
                                        <li key={activity._id} className="...">
                                            <div className="flex gap-3 items-start w-full">
                                                <div className="bg-primary/10 p-2 rounded-full">{Icon()}</div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base truncate">{activity.name}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                                        <MapPin className="w-4 h-4" /> {activity.location}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActivityToEdit(activity);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="btn btn-sm btn-ghost text-primary hover:bg-base-200"
                                                    title="Edit Activity"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
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
                                {filteredActivities.map((activity) => (
                                    <div
                                        key={activity._id}
                                        className="card bg-base-100 p-4 shadow rounded-xl relative"
                                    >
                                        {/* ✏️ Edit Icon Top Right */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActivityToEdit(activity);
                                                setIsModalOpen(true);
                                            }}
                                            className="absolute top-2 right-2 btn btn-xs btn-ghost text-primary hover:bg-base-200"
                                            title="Edit Activity"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <h3 className="font-semibold text-lg mb-1">{activity.name}</h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <CalendarDays className="w-4 h-4 inline" />{" "}
                                            {new Date(activity.time).toLocaleDateString()}
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
                                {filteredActivities.map((activity) => (
                                    <div key={activity._id} className="collapse collapse-arrow bg-base-100 shadow rounded-box">
                                        <input type="checkbox" className="peer" />

                                        {/* Collapse Title */}
                                        <div className="collapse-title peer-checked:bg-base-200 flex justify-between items-center">
                                            <span>{activity.name}</span>

                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(activity.time).toLocaleTimeString()}
                                                </span>

                                                {/* Prevent edit button click from toggling accordion */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // <--- important
                                                        e.stopPropagation(); // <--- required to prevent toggle
                                                        setActivityToEdit(activity);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="btn btn-xs btn-ghost hover:bg-base-200"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Collapse Content */}
                                        <div className="collapse-content text-sm text-gray-500 peer-checked:pb-4">
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
                        <p className="text-sm">
                            You're spending ₹{todayExpense.toLocaleString()} today.
                        </p>
                        <p className="text-sm">
                            {nextActivity
                                ? `Next activity in ${timeUntilNext}.`
                                : "No upcoming activity."}
                        </p>

                    </div>
                    <div className="bg-base-100 p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-2">Suggestions</h3>
                        {suggestions.length > 0 ? (
                            <ul className="list-disc ml-4 space-y-1 text-sm">
                                {suggestions.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">All set for now! 🎉</p>
                        )}

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
            {/* Floating Add Expense Button */}
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
                            <a onClick={() => setIsModalOpen(true)}>Add Expense</a>
                        </li>
                    </ul>
                </div>
            </div>

            <ActivityFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setActivityToEdit(null);
                    //  reset();
                }}
                initialData={activityToEdit}
            />


        </div>
    );
};

export default ActivitiesTab;
