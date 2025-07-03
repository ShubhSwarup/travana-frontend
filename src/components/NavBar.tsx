import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { RootState } from "../app/store";
import { logout } from "../features/user/userSlice";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-base-100 shadow-md">
      <div className="text-xl font-bold text-primary">Travana</div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-500">Not logged in</span>
        )}
      </div>
    </nav>
  );
}
