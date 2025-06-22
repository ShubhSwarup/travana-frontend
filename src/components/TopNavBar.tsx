import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon, Plus, Sparkles } from "lucide-react";
import CreateTripModal from "./CreateTripModal";
import GenerateTripModal, { AIGeneratedTripFormData } from "./GenerateTripModal";
import { AppDispatch } from "../app/store";
import { createTrip, generateAITrip } from "../features/trips/tripsThunk";
import { useLocation } from "react-router-dom";

export default function TopNavBar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreateAiModalOpen, setCreateAiModalOpen] = useState(false);
  const location = useLocation();
  const isAddTripPage = location.pathname === "/addtrips";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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

  const isDark = theme === "dark";

  return (
    <>
      <div className="navbar bg-base-100 shadow-md px-4 md:px-6 z-10">
        {/* Left logo */}
        <div className="flex-1">
          <span
            className="text-xl font-bold text-primary cursor-pointer"
            onClick={() => navigate("/trips")}
          >
            Travana
          </span>
        </div>

        {/* Right actions */}
        <div className="flex-none flex items-center gap-2">
          {/* Mobile buttons (icon only) */}
          {!isAddTripPage && (<div className="flex md:hidden gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setCreateModalOpen(true)}
              title="New Trip"
            >
              <Plus size={16} />
            </button>
            <button
              className="btn btn-sm btn-accent"
              onClick={() => setCreateAiModalOpen(true)}
              title="AI Trip"
            >
              <Sparkles size={16} />
            </button>
          </div>)}

          {/* Desktop buttons */}
          {!isAddTripPage && (<button
            className="btn btn-sm btn-primary hidden md:flex"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" /> New Trip
          </button>)}
          {!isAddTripPage && (<button
            className="btn btn-sm btn-accent hidden md:flex"
            onClick={() => setCreateAiModalOpen(true)}
          >
            <Sparkles className="w-4 h-4 mr-1" /> Trip with AI
          </button>)}

          {/* Theme toggle */}
          <label className="btn btn-ghost swap swap-rotate">
            <input
              type="checkbox"
              checked={isDark}
              onChange={() => setTheme(isDark ? "light" : "dark")}
            />
            <Sun className="swap-off w-5 h-5" />
            <Moon className="swap-on w-5 h-5" />
          </label>

          {/* Avatar */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                <span className="text-lg font-semibold">U</span>
              </div>
            </div>
            <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <button
                  onClick={handleLogout}
                  className="flex gap-2 items-center"
                >
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
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
