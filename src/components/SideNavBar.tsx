import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

import {
    LayoutDashboard,
    ListTodo,
    ClipboardList,
    Heart,
    Map,
    PlusCircle,
    Sparkles,
    LogOut,
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { createTrip, generateAITrip } from "../features/trips/tripsThunk";
import CreateTripModal from "./CreateTripModal";
import GenerateTripModal, { AIGeneratedTripFormData } from "./GenerateTripModal";

const tripTabs = [
    { label: "Overview", path: "", icon: LayoutDashboard },
    { label: "Activities", path: "activities", icon: ListTodo },
    { label: "Budget", path: "budget", icon: ClipboardList },
    { label: "Checklist", path: "checklist", icon: ClipboardList },
    { label: "Wishlist", path: "wishlist", icon: Heart },
    { label: "Map", path: "map", icon: Map },
];

export default function SideNavBar({ tripId, collapsed,
    setCollapsed,
}: {
    tripId: string, collapsed: boolean;
    setCollapsed: (val: boolean) => void;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { name, email, profilePic } = useSelector((state: RootState) => state.user);

    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
    // const [collapsed, setCollapsed] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isCreateAiModalOpen, setCreateAiModalOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleGenerateTrip = async (formData: AIGeneratedTripFormData) => {
        try {
            const trip = await dispatch(generateAITrip(formData)).unwrap();
            setCreateAiModalOpen(false);
            navigate(`/trip/${trip._id}`);
        } catch (error) {
            console.error("AI trip generation failed:", error);
        }
    };

    const handleCreateTrip = async (formData: any) => {
        try {
            const trip = await dispatch(createTrip(formData)).unwrap();
            setCreateModalOpen(false);
            navigate(`/trip/${trip._id}`);
        } catch (error) {
            console.error("Trip creation failed:", error);
        }
    };

    const DefaultAvatar = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <circle cx="12" cy="7" r="5" fill="#9ca3af" />
            <path
                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                fill="#9ca3af"
            />
        </svg>
    );


    const isDark = theme === "dark";
    const renderTabs = (showLabels: boolean) => (
        <ul className="space-y-2 text-lg font-medium">
            {tripTabs.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                    <NavLink
                        to={`/trip/${tripId}/${path}`}
                        end
                        className={({ isActive }) =>
                            `flex items-center ${showLabels ? "justify-start" : "justify-center"} 
             px-4 py-3 rounded-lg transition-all 
             ${isActive ? "bg-primary text-white shadow" : "hover:bg-base-300"}`
                        }
                    >
                        <Icon className={`w-6 h-6 ${showLabels ? "mr-3" : ""}`} />
                        {showLabels && label}
                    </NavLink>
                </li>
            ))}
        </ul>
    );


    return (
        <>
            {/* Universal Sidebar for All Devices */}
            <div className={`flex flex-col min-h-screen border-r border-base-300 bg-base-200 transition-[width] duration-300 ease-in-out ${collapsed ? "w-20" : "w-72"} p-4 justify-between`}>
                <div>
                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="btn btn-sm btn-ghost mb-6"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>

                    {/* App Icon/Title */}
                    <div className="flex items-center mb-6">
                        <img src="/images/logoBag.svg" className="w-16 h-16 object-contain rounded-none" alt="Travana Logo" />
                        {!collapsed &&
                            <span className="text-4xl font-bold bg-gradient-to-r from-travanaTeal via-travanaYellow to-travanaCoral bg-clip-text text-transparent font-['Clash_Display']">Travana</span>
                        }
                    </div>

                    {/* Avatar */}
                    {!collapsed ? (
                        <div className="flex items-center space-x-6 mb-10 ml-1">
                            <div className="avatar">
                                <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">

                                    <img src={profilePic ? profilePic : "/images/defaultAvatar.png"} alt="User" />

                                </div>
                            </div>
                            <div>
                                <p className="text-lg font-bold">{name ?? "User"}</p>
                                <p className="text-sm text-base-content/60">Traveler</p>
                            </div>
                        </div>
                    ) : (
                        <div className="avatar mb-10 flex justify-center">
                            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={profilePic ? profilePic : "/images/defaultAvatar.png"} alt="User" />

                            </div>
                        </div>
                    )}


                    {renderTabs(!collapsed)}
                </div>

                {/* Bottom Section */}
                <div className="space-y-2 pt-6 border-t border-base-300">
                    <NavLink
                        to="/alltrips"
                        className={`flex items-center ${collapsed ? "justify-center" : "justify-start"
                            } px-4 py-3 rounded-lg text-base font-medium hover:bg-base-300`}
                    >
                        <span className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`}>←</span>
                        {!collapsed && "All Trips"}
                    </NavLink>
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-base-300 ${collapsed ? "justify-center" : "justify-start"}`}
                    >
                        <PlusCircle className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
                        {!collapsed && "New Trip"}
                    </button>

                    <button
                        onClick={() => setCreateAiModalOpen(true)}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-base-300 ${collapsed ? "justify-center" : "justify-start"}`}
                    >
                        <Sparkles className={`w-5 h-5 text-warning ${collapsed ? "" : "mr-3"}`} />
                        {!collapsed && "Trip with AI"}
                    </button>

                    <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-base-300 ${collapsed ? "justify-center" : "justify-start"}`}
                    >
                        {isDark ? (
                            <Sun className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
                        ) : (
                            <Moon className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
                        )}
                        {!collapsed && "Toggle Theme"}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-error text-error hover:text-white ${collapsed ? "justify-center" : "justify-start"}`}
                    >
                        <LogOut className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
                        {!collapsed && "Logout"}
                    </button>

                </div>
            </div >

            {/* Modals */}
            < CreateTripModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)
                }
                onGenerate={handleCreateTrip}
            />
            <GenerateTripModal
                isOpen={isCreateAiModalOpen}
                onClose={() => setCreateAiModalOpen(false)}
                onGenerate={handleGenerateTrip}
            />
        </>
    );
}