import { AppError, type AppErrorOptions } from "./app-error.ts";

type Options = Omit<AppErrorOptions, "code"> & { code?: string };

export class BadRequestError extends AppError {
  constructor(message = "Bad request", options: Options = {}) {
    super(message, 400, { code: "BAD_REQUEST", ...options });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", options: Options = {}) {
    super(message, 401, { code: "UNAUTHORIZED", ...options });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", options: Options = {}) {
    super(message, 403, { code: "FORBIDDEN", ...options });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", options: Options = {}) {
    super(message, 404, { code: "NOT_FOUND", ...options });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", options: Options = {}) {
    super(message, 409, { code: "CONFLICT", ...options });
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", options: Options = {}) {
    super(message, 422, { code: "VALIDATION_FAILED", ...options });
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests", options: Options = {}) {
    super(message, 429, { code: "TOO_MANY_REQUESTS", ...options });
  }
}

export class InternalError extends AppError {
  constructor(message = "Internal server error", options: Options = {}) {
    super(message, 500, { code: "INTERNAL_ERROR", ...options });
  }
}
