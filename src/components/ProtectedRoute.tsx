import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
