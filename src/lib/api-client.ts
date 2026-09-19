/**
 * QTransit API Client
 * Centralized HTTP client for all backend requests.
 * Base URL is read from the VITE_API_BASE_URL environment variable.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// ─── Token helpers ───────────────────────────────────────────────────────────

export const getStoredToken = (): string | null =>
  localStorage.getItem("qtransit_auth_token");

export const setStoredToken = (token: string): void =>
  localStorage.setItem("qtransit_auth_token", token);

export const removeStoredToken = (): void =>
  localStorage.removeItem("qtransit_auth_token");

// ─── Error class ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly detail?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** If true, does NOT inject the Authorization header */
  public?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, public: isPublic, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string> | undefined),
  };

  // Inject bearer token for authenticated routes
  if (!isPublic) {
    const token = getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // FastAPI returns { detail: string | ValidationError[] }
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : response.status === 401
        ? "Session expirée. Veuillez vous reconnecter."
        : response.status === 422
        ? "Données invalides. Vérifiez les champs du formulaire."
        : `Erreur serveur (${response.status})`;

    throw new ApiError(response.status, message, data?.detail);
  }

  return data as T;
}
