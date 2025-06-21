import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";

export default function TopNavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Add/remove Tailwind dark mode class
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

  const isDark = theme === "dark";

  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <span
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/trips")}
        >
          Travana
        </span>
      </div>
      <div className="flex-none gap-4 items-center">
        {/* Theme Switcher */}
        <label className="btn btn-ghost swap swap-rotate">
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setTheme(isDark ? "light" : "dark")}
          />
          <Sun className="swap-off w-5 h-5" />
          <Moon className="swap-on w-5 h-5" />
        </label>

        {/* Profile Dropdown */}
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
  );
}
