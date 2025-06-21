import React from 'react'
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom"

const TripsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // or /login
  };

  return (
    <div>Trips page
     <button className="btn btn-outline btn-error" onClick={handleLogout}>
      Logout
    </button>
    </div>
    
  )
}

export default TripsPage;