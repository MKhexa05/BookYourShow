import { Navigate } from "react-router-dom";
import useUserAuth from "../hooks/useUserAuth";
import type { JSX } from "react";
import FullPageLoader from "./FullPageLoader";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useUserAuth();

  
  if (isLoading) return <FullPageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
