import TopNavBar from "../components/TopNavBar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <TopNavBar />
      <Outlet />
    </div>
  );
}
