import { Navigate } from "react-router-dom";
import useUserAuth from "../hooks/useUserAuth";
import type { JSX } from "react";
import FullPageLoader from "./FullPageLoader";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useUserAuth();
  
  if (isLoading) return <FullPageLoader />;

  // 🚫 Authenticated users cannot access auth pages
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
