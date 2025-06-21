// src/components/auth/AuthModal.jsx
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import AuthForm from "./AuthFrom";

export default function AuthModal({ isOpen, onClose, mode = "login" }) {
  const [formMode, setFormMode] = useState(mode);

  const isSignup = formMode === "signup";

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
            {/* <form className="space-y-4">
              {isSignup && (
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered w-full"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
              />
              <button className="btn btn-primary w-full">
                {isSignup ? "Create account" : "Log in"}
              </button>
            </form> */}
            
            <AuthForm
              mode={formMode}
              onSubmit={(data) => {
                console.log("Form submitted", data);
                // TODO: Call API or handle auth logic here
              }}
            />
            <div className="text-sm text-center mt-4">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="link link-primary"
                    onClick={() => setFormMode("login")}
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    className="link link-primary"
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
}

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["login", "signup"]),
};
