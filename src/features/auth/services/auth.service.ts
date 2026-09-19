/**
 * QTransit Auth Service
 * Wraps all authentication-related API calls.
 */

import { apiFetch } from "@/lib/api-client";
import type { User } from "@/types";

// ─── API Response shapes (backend schema) ────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/** Shape returned by GET /auth/me */
export interface UserMeResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  company_id: number | null;
  agency_id: number | null;
  is_active: boolean;
}

// ─── Mapper: API → Frontend User ─────────────────────────────────────────────

/**
 * Converts the backend UserMeResponse (snake_case, integer IDs) into
 * the frontend User type (camelCase, string IDs) used throughout the app.
 */
export function mapApiUserToUser(apiUser: UserMeResponse): User {
  return {
    id: String(apiUser.id),
    email: apiUser.email,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    // Map user_type to the closest RoleType; keep original as fallback
    role: (apiUser.user_type as User["role"]) ?? "AGENCY_MANAGER",
    companyId: apiUser.company_id !== null ? String(apiUser.company_id) : "",
    agencyId: apiUser.agency_id !== null ? String(apiUser.agency_id) : undefined,
    isActive: apiUser.is_active,
  };
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /auth/login
   * Returns the raw token response from the API.
   */
  login: (credentials: LoginRequest): Promise<TokenResponse> =>
    apiFetch<TokenResponse>("/auth/login", {
      method: "POST",
      body: credentials,
      public: true, // No auth header needed
    }),

  /**
   * GET /auth/me
   * Fetch the authenticated user's profile.
   * The token must already be stored before calling this.
   */
  getMe: (): Promise<UserMeResponse> =>
    apiFetch<UserMeResponse>("/auth/me"),
};
