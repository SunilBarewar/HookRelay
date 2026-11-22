import axios, { AxiosError } from "axios";

/** Normalised error thrown by every apiClient call (matches the API's error shape). */
export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(message: string, opts: { status?: number; code?: string; details?: unknown } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
  }
}

interface ApiErrorBody {
  message?: string;
  code?: string;
  details?: unknown;
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  // The auth token lives in an httpOnly cookie set by the API, so the browser must send it.
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error instanceof AxiosError) {
      const body = error.response?.data as ApiErrorBody | undefined;
      throw new ApiError(body?.message ?? error.message, {
        status: error.response?.status,
        code: body?.code,
        details: body?.details,
      });
    }
    throw error;
  },
);
