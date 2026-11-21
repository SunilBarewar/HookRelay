/** Thrown for every non-2xx response. Mirrors the API's error body. */
export class HookRelayError extends Error {
  /** HTTP status code, e.g. 401, 404, 422. */
  readonly status: number;
  /** Machine-readable error code from the API, e.g. "NOT_FOUND". */
  readonly code: string;
  readonly details?: unknown;

  constructor(params: { status: number; code: string; message: string; details?: unknown }) {
    super(params.message);
    this.name = "HookRelayError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}
