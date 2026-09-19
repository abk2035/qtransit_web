import React, { createContext, useContext, useState, useEffect } from "react";
import { User, RoleType } from "@/types";
import {
  LoginCredentials,
  AuthResponse,
  UserProfileUpdate,
  ChangePasswordRequest,
} from "@/features/auth/types";
import {
  authService,
  mapApiUserToUser,
} from "@/features/auth/services/auth.service";
import {
  setStoredToken,
  removeStoredToken,
  ApiError,
} from "@/lib/api-client";

// ─── Demo Users (used for quick UI exploration without a real backend account) ─

export const DEMO_USERS: Record<string, { user: User; pass: string }> = {
  admin: {
    user: {
      id: "usr-admin-01",
      firstName: "Alexandre",
      lastName: "Kouadio",
      email: "admin@qtransit.com",
      phone: "+225 07 00 11 22 33",
      role: "COMPANY_ADMIN",
      agencyId: "ag-1",
      agencyName: "Gare Centrale — Abidjan",
      companyId: "comp-01",
      isActive: true,
    },
    pass: "admin123",
  },
  manager: {
    user: {
      id: "usr-manager-02",
      firstName: "Alain",
      lastName: "Dupont",
      email: "manager@qtransit.com",
      phone: "+225 05 44 55 66 77",
      role: "AGENCY_MANAGER",
      agencyId: "ag-1",
      agencyName: "Gare Centrale — Abidjan",
      companyId: "comp-01",
      isActive: true,
    },
    pass: "manager123",
  },
  cashier: {
    user: {
      id: "usr-cashier-03",
      firstName: "Awa",
      lastName: "Touré",
      email: "cashier@qtransit.com",
      phone: "+225 01 88 99 00 11",
      role: "CASHIER",
      agencyId: "ag-1",
      agencyName: "Gare Centrale — Abidjan",
      companyId: "comp-01",
      isActive: true,
    },
    pass: "cashier123",
  },
  controller: {
    user: {
      id: "usr-ctrl-04",
      firstName: "Salif",
      lastName: "Bamba",
      email: "controller@qtransit.com",
      phone: "+225 07 22 33 44 55",
      role: "CONTROLLER",
      agencyId: "ag-2",
      agencyName: "Gare Nord — Bouaké",
      companyId: "comp-01",
      isActive: true,
    },
    pass: "controller123",
  },
};

// ─── Whether credentials match a known demo account ──────────────────────────

function isDemoCredentials(email: string, password: string): boolean {
  return Object.values(DEMO_USERS).some(
    (d) =>
      d.user.email.toLowerCase() === email.toLowerCase() &&
      d.pass === password
  );
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginAsDemo: (roleKey: keyof typeof DEMO_USERS) => Promise<void>;
  logout: () => void;
  sendPasswordResetCode: (email: string) => Promise<boolean>;
  confirmPasswordReset: (email: string, code: string, newPass: string) => Promise<boolean>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  updateProfile: (data: UserProfileUpdate) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  hasRole: (role: RoleType) => boolean;
  hasAnyRole: (roles: RoleType[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Auth Provider ────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("qtransit_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("qtransit_auth_token");
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state → localStorage on every change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("qtransit_user", JSON.stringify(user));
      // Token is already written to localStorage via setStoredToken() at login time
    } else {
      localStorage.removeItem("qtransit_user");
      removeStoredToken();
    }
  }, [user, token]);

  // ─── login ────────────────────────────────────────────────────────────────
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      // ── Path 1: Demo accounts → instant mock login (no backend needed) ──
      if (isDemoCredentials(credentials.email, credentials.password)) {
        const demoEntry = Object.values(DEMO_USERS).find(
          (d) =>
            d.user.email.toLowerCase() === credentials.email.toLowerCase() &&
            d.pass === credentials.password
        )!;

        const mockToken =
          "demo_" + Math.random().toString(36).substring(2) + Date.now();
        setStoredToken(mockToken);
        setUser(demoEntry.user);
        setToken(mockToken);
        setIsLoading(false);

        return {
          user: demoEntry.user,
          token: mockToken,
          refreshToken: "refresh_" + mockToken,
          expiresIn: 86400,
        };
      }

      // ── Path 2: Real backend authentication ──────────────────────────────
      const tokenResponse = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });

      // Store the real JWT so subsequent calls (getMe, etc.) can use it
      setStoredToken(tokenResponse.access_token);

      // Fetch full user profile
      const apiUser = await authService.getMe();
      const frontendUser = mapApiUserToUser(apiUser);

      setUser(frontendUser);
      setToken(tokenResponse.access_token);
      setIsLoading(false);

      return {
        user: frontendUser,
        token: tokenResponse.access_token,
        refreshToken: "", // Backend does not provide a refresh token yet
        expiresIn: tokenResponse.expires_in,
      };
    } catch (error) {
      setIsLoading(false);

      // Re-throw ApiError as-is so the form can display the correct message
      if (error instanceof ApiError) {
        throw error;
      }

      // Network error or unexpected failure
      throw new Error(
        error instanceof Error ? error.message : "Erreur de connexion"
      );
    }
  };

  // ─── loginAsDemo ──────────────────────────────────────────────────────────
  const loginAsDemo = async (roleKey: keyof typeof DEMO_USERS): Promise<void> => {
    const target = DEMO_USERS[roleKey];
    if (target) {
      await login({ email: target.user.email, password: target.pass });
    }
  };

  // ─── logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // ─── Password reset (mock – to be wired when backend supports it) ─────────
  const sendPasswordResetCode = async (_email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return true;
  };

  const confirmPasswordReset = async (
    _email: string,
    _code: string,
    _newPass: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  };

  // ─── 2FA (mock – to be wired when backend supports it) ───────────────────
  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return code.length === 6;
  };

  // ─── Profile update (local only for now) ─────────────────────────────────
  const updateProfile = async (data: UserProfileUpdate): Promise<void> => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  // ─── Password change (mock – to be wired when backend supports it) ────────
  const changePassword = async (_data: ChangePasswordRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
  };

  // ─── Role helpers ─────────────────────────────────────────────────────────
  const hasRole = (role: RoleType): boolean => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;
    return user.role === role;
  };

  const hasAnyRole = (roles: RoleType[]): boolean => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        loginAsDemo,
        logout,
        sendPasswordResetCode,
        confirmPasswordReset,
        verifyTwoFactor,
        updateProfile,
        changePassword,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
