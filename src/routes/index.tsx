import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "./protected-route";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { TwoFactorForm } from "@/features/auth/components/two-factor-form";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { TripsView } from "@/features/trips/components/trips-view";
import { FleetView } from "@/features/fleet/components/fleet-view";
import { EmployeesView } from "@/features/employees/components/employees-view";
import { TicketingView } from "@/features/ticketing/components/ticketing-view";
import { CustomersView } from "@/features/customers/components/customers-view";
import { AgenciesView } from "@/features/agencies/components/agencies-view";
import { SettingsView } from "@/features/settings/components/settings-view";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginForm />
          </AuthLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout>
            <ForgotPasswordForm />
          </AuthLayout>
        }
      />
      <Route
        path="/2fa"
        element={
          <AuthLayout>
            <TwoFactorForm />
          </AuthLayout>
        }
      />

      {/* Protected ERP Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/trips" element={<TripsView />} />
          <Route path="/fleet" element={<FleetView />} />
          <Route path="/employees" element={<EmployeesView />} />
          <Route path="/ticketing" element={<TicketingView />} />
          <Route path="/tickets" element={<TicketingView />} />
          <Route path="/customers" element={<CustomersView />} />
          <Route path="/agencies" element={<AgenciesView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
