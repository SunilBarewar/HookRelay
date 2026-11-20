export interface AppErrorOptions {
  /** Machine-readable error code, e.g. "EMAIL_ALREADY_EXISTS". */
  code?: string;
  /** Extra structured info safe to return to the client. */
  details?: unknown;
  cause?: unknown;
}

/**
 * Base class for all expected (operational) errors. Carries an HTTP status
 * code so the API can map it straight to a response, while the worker can
 * simply log or retry based on `code`.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    { code = "INTERNAL_ERROR", details, cause }: AppErrorOptions = {},
  ) {
    super(message, { cause });
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      error: this.name,
      code: this.code,
      message: this.message,
      ...(this.details !== undefined && { details: this.details }),
    };
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
