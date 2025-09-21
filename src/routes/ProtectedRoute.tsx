import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="animate-pulse text-sm text-slate-500">
          Checking session…
        </div>
      </div>
    );
  }

  if (!user) {
    // send user to login, but remember where they were going
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
