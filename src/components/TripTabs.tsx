import { useState } from "react";
import { Trip } from "../types/trips";
import TripPolaroidCard from "./TripPolaroidCard";
import { AnimatePresence, motion } from "framer-motion";
import { Hourglass, MapPin, Archive, Calendar } from "lucide-react";

type TabType = "Upcoming" | "Active" | "Past" | "Planned";

const TABS: { key: TabType; label: string; Icon: any }[] = [
    { key: "Upcoming", label: "Upcoming", Icon: Hourglass },
    { key: "Active", label: "Active", Icon: MapPin },
    { key: "Past", label: "Past", Icon: Archive },
    { key: "Planned", label: "Planned", Icon: Calendar },
];

const getTripCategory = (trip: Trip): TabType => {
    const now = new Date();
    const start = trip.startDate ? new Date(trip.startDate) : null;
    const end = trip.endDate ? new Date(trip.endDate) : null;

    if (!start || !end) return "Planned";
    if (end < now) return "Past";
    if (start > now) return "Upcoming";
    return "Active";
};

export default function TripTabs({ trips }: { trips: Trip[] }) {
    const [activeTab, setActiveTab] = useState<TabType>("Upcoming");

    const categorized: Record<TabType, Trip[]> = {
        Upcoming: [],
        Active: [],
        Past: [],
        Planned: [],
    };

    trips.forEach((trip) => {
        categorized[getTripCategory(trip)].push(trip);
    });

    return (
        <div className="w-full">
            {/* Tabs: scrollable on mobile, centered on larger screens */}

            <div className="w-full overflow-x-auto">
                <div className="tabs tabs-boxed bg-base-100/70 backdrop-blur-md rounded-lg shadow-sm flex justify-center flex-nowrap gap-2 px-2 py-1 min-w-max">
                    {TABS.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            className={`tab tab-lifted flex items-center gap-2 transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium ${activeTab === key
                                ? "tab-active bg-primary text-white"
                                : "hover:bg-base-300 bg-base-200 text-base-content"
                                }`}
                            onClick={() => setActiveTab(key)}
                        >
                            <Icon size={16} />
                            {label}
                            <span className="badge badge-sm badge-outline">
                                {categorized[key].length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>


            {/* Tab Content with fade + slide animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                >
                    {categorized[activeTab].length === 0 ? (
                        <div className="text-center text-gray-500">No trips found.</div>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
                            {categorized[activeTab].map((trip) => (
                                <TripPolaroidCard key={trip._id} trip={trip} />
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
