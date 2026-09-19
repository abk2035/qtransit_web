import { User, RoleType } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  requiresTwoFactor?: boolean;
  expiresIn: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface TwoFactorRequest {
  code: string;
  tempToken: string;
}

export interface UserProfileUpdate {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
