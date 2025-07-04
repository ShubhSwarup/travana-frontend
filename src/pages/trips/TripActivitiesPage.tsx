import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Plus, Pencil, SlidersHorizontal, List, LayoutGrid, Rows, CheckCircle, Wallet, Clock, Tag } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchActivities } from "../../features/activities/activitiesThunk";
import { categoryIcons } from "../../utils/iconMapper";
import useMediaQuery from "../../hooks/useMediaQuery";
import { ACTIVITY_CATEGORIES, ACTIVITY_SORT_OPTIONS } from "../../utils/constants";
import ActivityFormModal, { ActivityFormValues } from "../../components/ActivityFormModal";
import { fetchTripOverview } from "../../features/trips/tripsThunk";

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
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const overview = useSelector((state: RootState) => state.trips.selectedTripOverview);

    useEffect(() => {
        if (tripId) {
            dispatch(fetchActivities(tripId));
        }
    }, [tripId]);

    useEffect(() => {
        if (tripId && !overview) {
            dispatch(fetchTripOverview(tripId));
        }
    }, [tripId, overview]);

    const tripStartDate = overview?.trip?.startDate ? new Date(overview.trip.startDate) : null;
    const tripEndDate = overview?.trip?.endDate ? new Date(overview.trip.endDate) : null;

    const now = new Date().getTime();

    const sortedAllActivities = [...activities].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    // const tripStartDate = sortedAllActivities.length > 0 ? new Date(sortedAllActivities[0].time) : null;

    // Filter for upcoming if needed
    const baseActivities = activities.filter((activity) => {
        if (upcomingOnly && new Date(activity.time).getTime() < now) {
            return false;
        }
        return true;
    });

    const dayMap: Record<string, typeof activities> = {};

    if (tripStartDate) {
        baseActivities.forEach((activity) => {
            const activityDate = new Date(activity.time);
            const dayDiff = Math.floor(
                (activityDate.getTime() - tripStartDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const dayLabel = `Day ${dayDiff + 1}`;

            if (!dayMap[dayLabel]) {
                dayMap[dayLabel] = [];
            }

            dayMap[dayLabel].push(activity);
        });

        // Sort activities within each day
        Object.keys(dayMap).forEach((day) => {
            dayMap[day].sort(
                (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
            );
        });
    }

    const dayDateMap: Record<string, Date> = {};
    if (tripStartDate) {
        Object.keys(dayMap).forEach((label) => {
            const dayNum = parseInt(label.split(" ")[1]);
            if (!isNaN(dayNum)) {
                const date = new Date(tripStartDate);
                date.setDate(date.getDate() + (dayNum - 1));
                dayDateMap[label] = date;
            }
        });
    }

    if (overview?.trip?.startDate) {
        const start = new Date(overview.trip.startDate);
        Object.keys(dayMap).forEach((label) => {
            const dayNum = parseInt(label.split(" ")[1]);
            if (!isNaN(dayNum)) {
                const date = new Date(start);
                date.setDate(date.getDate() + (dayNum - 1));
                dayDateMap[label] = date;
            }
        });
    }

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
        // <div className="max-w-screen-2xl mx-auto p-4">
        <div className="max-w-screen-2xl mx-auto p-4 h-[calc(100vh-4rem)]">

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:h-[calc(100vh-4rem)]">
                {!isMobile && (
                    <aside className="space-y-6">
                        <div className="bg-base-100 p-4 rounded-xl shadow">
                            <details className="lg:open">
                                <summary className="font-semibold text-sm uppercase cursor-pointer text-gray-500">Filters</summary>
                                <div className="space-y-3 mt-3">
                                    <select className="select select-sm w-full" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                        {ACTIVITY_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <select className="select select-sm w-full" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                        {ACTIVITY_SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                    <label className="label cursor-pointer justify-start gap-2">
                                        <input type="checkbox" className="checkbox checkbox-primary" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} />
                                        <span className="label-text text-sm">Upcoming Only</span>
                                    </label>
                                </div>
                            </details>
                        </div>

                        <div className="bg-base-100 p-4 rounded-xl shadow">
                            <details className="lg:open">
                                <summary className="font-semibold text-sm uppercase cursor-pointer text-gray-500">Suggestions</summary>
                                <div className="mt-2">
                                    {suggestions.length > 0 ? <ul className="list-disc ml-4 space-y-1 text-sm">{suggestions.map((tip, i) => <li key={i}>{tip}</li>)}</ul> : <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-success" /> All set for now!
                                    </p>
                                    }
                                </div>
                            </details>
                        </div>

                        <div className="bg-base-100 p-4 rounded-xl shadow">
                            <h3 className="font-semibold mb-2">Quick Summary</h3>
                            <p className="text-sm mb-1 flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-primary" /> Spending today: ₹{todayExpense.toLocaleString()}
                            </p>
                            <p className="text-sm flex items-center gap-2">
                                {nextActivity ? (
                                    <>
                                        <Clock className="w-4 h-4 text-primary" /> Next activity in {timeUntilNext}
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-4 h-4 text-primary" /> No upcoming activity
                                    </>
                                )}
                            </p>

                        </div>
                    </aside>
                )}

                {/* <main className="flex flex-col gap-4 w-full relative"> */}
                <main className="flex flex-col gap-4 w-full relative h-full overflow-hidden">

                    <div className="sticky top-0 z-10 bg-base-100 pt-3 pb-4 border-b overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 w-max px-2">
                            {dayTabs.map((day) => {
                                const isActive = selectedDay === day;
                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(isActive ? null : day)}
                                        className={`transition-all duration-200 px-4 py-1.5 text-sm font-medium rounded-full border 
            ${isActive
                                                ? "bg-primary text-primary-content border-primary shadow-sm"
                                                : "bg-base-200 text-base-content hover:bg-primary/10 hover:border-primary/30 border-base-300"
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>


                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex gap-2">
                            {["list", "card", "accordion"].map((v) => (
                                <button key={v} className={`btn btn-sm flex items-center gap-1 ${view === v ? "btn-primary" : "btn-outline"}`} onClick={() => setView(v as typeof view)}>
                                    {v === "list" && <List className="w-4 h-4" />}
                                    {v === "card" && <LayoutGrid className="w-4 h-4" />}
                                    {v === "accordion" && <Rows className="w-4 h-4" />}
                                    <span className="capitalize">{v}</span>
                                </button>
                            ))}
                        </div>
                        {!isMobile && (
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-sm btn-primary"><Plus className="w-4 h-4 mr-1" /> Add Activity</button>
                        )}
                    </div>

                    {/* <div className="flex-1 overflow-y-auto min-h-[200px]"> */}



                    <div className="flex-1 overflow-y-auto min-h-0 pr-2">



                        {view === 'list' && (
                            <ul className="space-y-4">
                                {filteredActivities.map((activity) => {
                                    const Icon = categoryIcons[activity.category] || MapPin;
                                    return (
                                        <li
                                            key={activity._id}
                                            className="flex items-start gap-4 bg-base-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="shrink-0">
                                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-base text-base-content truncate">{activity.name}</h3>
                                                    <button
                                                        onClick={() => {
                                                            setActivityToEdit(activity);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="btn btn-xs btn-ghost text-primary hover:bg-base-200"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-sm text-neutral-content/80 flex flex-wrap items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="truncate">{activity.location}</span>
                                                    <span className="text-gray-500">|</span>
                                                    <CalendarDays className="w-4 h-4" />
                                                    <span>{new Date(activity.time).toLocaleDateString()}</span>
                                                    <span className="ml-auto badge badge-sm badge-outline">{activity.category}</span>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}



                        {view === 'card' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredActivities.map((activity) => {
                                    const Icon = categoryIcons[activity.category] || categoryIcons["location"];
                                    return (
                                        <div
                                            key={activity._id}
                                            className="relative card bg-base-100 shadow-sm hover:shadow-md transition-shadow p-4 rounded-xl"
                                        >
                                            {/* Fix: add padding to avoid overlap */}
                                            <div className="pr-10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                                                        <Icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <h3 className="font-semibold text-lg text-base-content truncate">
                                                        {activity.name}
                                                    </h3>
                                                </div>

                                                <p className="text-sm text-neutral-content/80 flex items-center gap-2 mb-1">
                                                    <CalendarDays className="w-4 h-4" />{" "}
                                                    {new Date(activity.time).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-neutral-content/80 flex items-center gap-2 mb-2">
                                                    <MapPin className="w-4 h-4" /> {activity.location}
                                                </p>
                                                <div className="badge badge-outline badge-primary">{activity.category}</div>
                                            </div>

                                            {/* Positioned absolutely with spacing */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActivityToEdit(activity);
                                                    setIsModalOpen(true);
                                                }}
                                                className="absolute top-3 right-3 btn btn-xs btn-ghost text-primary hover:bg-base-200"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}


                        {view === 'accordion' && (
                            <div className="space-y-3">
                                {filteredActivities.map((activity) => {
                                    const Icon = categoryIcons[activity.category] || categoryIcons["location"];
                                    return (
                                        <div
                                            key={activity._id}
                                            className="collapse collapse-arrow bg-base-100 rounded-box shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <input type="checkbox" className="peer" />
                                            <div className="collapse-title peer-checked:bg-base-200 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                                                        <Icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h4 className="font-semibold text-base-content text-sm sm:text-base">{activity.name}</h4>
                                                        <span className="text-xs text-neutral-content/70">
                                                            {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setActivityToEdit(activity);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="btn btn-xs btn-ghost text-primary hover:bg-base-200"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="collapse-content text-sm text-neutral-content/80 space-y-2 peer-checked:pb-4">
                                                <p><MapPin className="inline w-4 h-4 mr-1" /> {activity.location}</p>
                                                <p><CalendarDays className="inline w-4 h-4 mr-1" /> {new Date(activity.time).toLocaleDateString()}</p>
                                                <p className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-primary" />
                                                    <span>Category: </span>
                                                    <span className="badge badge-outline badge-sm">{activity.category}</span>
                                                </p>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}







                        {/* <p className="text-center text-gray-400 text-sm py-10">Rendered activity list will show here (based on view).</p> */}
                    </div>
                </main>
            </div>

            {/* Floating Button (Mobile only) */}
            {isMobile && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                    <button onClick={() => setIsFilterSheetOpen(true)} className="btn btn-sm btn-circle btn-outline"><SlidersHorizontal className="w-4 h-4" /></button>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-circle btn-lg shadow-lg"><Plus className="w-5 h-5" /></button>
                </div>
            )}

            {isMobile && isFilterSheetOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur z-50 flex items-end">
                    <div className="bg-base-100 w-full rounded-t-xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold">Filters & Summary</h3>
                            <button className="btn btn-sm btn-outline" onClick={() => setIsFilterSheetOpen(false)}>Close</button>
                        </div>
                        <div className="space-y-3">
                            <select className="select select-sm w-full" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                {ACTIVITY_CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
                            </select>
                            <select className="select select-sm w-full" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                {ACTIVITY_SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <label className="label cursor-pointer gap-2">
                                <input type="checkbox" className="checkbox checkbox-primary" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} />
                                <span className="label-text">Upcoming Only</span>
                            </label>
                            <div className="divider">Summary</div>
                            <p className="text-sm">Today's Spending: ₹{todayExpense.toLocaleString()}</p>
                            <p className="text-sm">{nextActivity ? `Next in ${timeUntilNext}` : "No upcoming activity."}</p>
                            <ul className="list-disc ml-4 text-sm space-y-1">
                                {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <ActivityFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setActivityToEdit(null);
                }}
                initialData={activityToEdit}
                dayMap={dayDateMap}
                tripStartDate={overview?.trip?.startDate}
                tripEndDate={overview?.trip?.endDate}
            />
        </div>
    );
};

export default ActivitiesTab;
