import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function TopNavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <span className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate("/trips")}>Travana</span>
      </div>
      <div className="flex-none gap-4">
        {/* Optional: dark mode toggle */}
        <label className="swap swap-rotate">
          <input type="checkbox" className="theme-controller" value="dark" />
          <svg
            className="swap-on fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64 17.64A9 9 0 1 0 12 3a9.003 9.003 0 0 0-6.36 14.64z" />
          </svg>
          <svg
            className="swap-off fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1zm5.657 3.343a1 1 0 0 0-1.414 0l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0 0-1.414zM21 11h-2a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zM6.343 5.343a1 1 0 0 0 0 1.414L7.757 8.17a1 1 0 1 0 1.414-1.414L7.757 5.343a1 1 0 0 0-1.414 0zM4 11H2a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm2.343 7.657a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 0 1.414zM11 20h2a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2zm5.657-1.343a1 1 0 0 0 1.414 0 1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 1 0-1.414 1.414l1.414 1.414z" />
          </svg>
        </label>

        {/* Profile dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
              <span className="text-lg font-semibold">U</span>
            </div>
          </div>
          <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <button onClick={handleLogout} className="flex gap-2 items-center">
                <LogOut size={16} /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
