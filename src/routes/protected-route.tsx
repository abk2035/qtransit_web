import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { RoleType } from "@/types";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  allowedRoles?: RoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, hasAnyRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center my-auto min-h-[50vh]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-danger-light dark:bg-rose-950/60 text-status-danger mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-text-primary dark:text-white">Accès restreint</h2>
        <p className="text-sm text-text-secondary dark:text-slate-400 mt-2 max-w-md">
          Votre rôle actuel (<strong>{user.role}</strong>) ne dispose pas des permissions nécessaires pour accéder à ce module.
        </p>
        <Button variant="primary" size="md" className="mt-6" onClick={() => window.history.back()}>
          Retour
        </Button>
      </div>
    );
  }

  return <Outlet />;
};
