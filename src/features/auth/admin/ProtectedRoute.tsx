import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import type { AdminRole } from "@/lib/database.types";

export function ProtectedRoute({ requireRole }: { requireRole?: AdminRole }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-charcoal">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requireRole && session.role !== requireRole) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
