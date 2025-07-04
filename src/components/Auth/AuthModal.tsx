// src/components/auth/AuthModal.jsx
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import AuthForm from "./AuthFrom";
import { AuthMode } from "../../types/auth";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../features/auth/authThunks";
import { fetchTrips } from "../../features/trips/tripsThunk";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode = "login",
}) => {
  const [formMode, setFormMode] = useState<AuthMode>(mode);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isSignup = formMode === "signup";
  const [formError, setFormError] = useState("");

  const handleFormSubmit = async (data: any) => {
    setFormError("");
    try {
      if (mode === "login") {
        await dispatch(loginUser(data)).unwrap();
      } else {
        await dispatch(registerUser(data)).unwrap();
      }

      //   Now fetch trips
      await dispatch(fetchTrips()).unwrap();
      const trips = store.getState().trips.trips; //This avoids calling trips API multiple times and stores it in Redux.
      //   Navigate based on number of trips
      if (trips.length === 0) {
        navigate("/addtrips");
      } else if (trips.length === 1) {
        navigate(`/trip/${trips[0]._id}`);
      } else {
        navigate("/alltrips");
      }
    } catch (err) {
      setFormError("Something went wrong");
      console.error("Auth error", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-base-100 rounded-xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Image - Hidden on Mobile */}
          <div className="hidden md:block md:w-1/2 h-96">
            <img
              src={isSignup ? "/images/signup.jpg" : "/images/login.jpg"}
              alt="Auth visual"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-9 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
            >
              <X className="w-4 h-4" />
            </button>
            <DialogTitle className="text-lg font-bold mb-4 text-center">
              {isSignup
                ? "Sign up for a new account"
                : "Log in to your account"}
            </DialogTitle>
            <AuthForm
              mode={formMode}
              onSubmit={handleFormSubmit}
              formError={formError}
            />
            <div className="text-sm text-center mt-4">
              {isSignup ? (
                <>
                  Already have an account?
                  <button
                    className="ml-2 link link-primary first-letter: ,"
                    onClick={() => setFormMode("login")}
                  >
                    Log in</button>
                </>
              ) : (
                <>
                  Don’t have an account?
                  <button
                    className="ml-2 link link-primary"
                    onClick={() => setFormMode("signup")}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AuthModal;
