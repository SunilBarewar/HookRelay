import { AppError, ConflictError, ValidationError, isAppError, isDevelopment } from "@hookrelay/shared";
import type { FastifyError, FastifyInstance } from "fastify";
import { ZodError } from "zod";

const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";

/** Drizzle wraps driver errors, so walk the `cause` chain to find the Postgres one. */
function findPostgresError(err: unknown): { code: string; constraint_name?: string } | undefined {
  let current: unknown = err;
  for (let depth = 0; current && depth < 5; depth++) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string" && /^[0-9A-Z]{5}$/.test(code)) {
      return current as { code: string; constraint_name?: string };
    }
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

/** Translate known library errors into AppErrors; return undefined if unknown. */
function toAppError(err: unknown): AppError | undefined {
  if (isAppError(err)) return err;

  if (err instanceof ZodError) {
    return new ValidationError("Validation failed", {
      details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      cause: err,
    });
  }

  const pg = findPostgresError(err);
  if (pg?.code === PG_UNIQUE_VIOLATION) {
    return new ConflictError("Resource already exists", {
      code: "ALREADY_EXISTS",
      details: pg.constraint_name ? { constraint: pg.constraint_name } : undefined,
      cause: err,
    });
  }
  if (pg?.code === PG_FOREIGN_KEY_VIOLATION) {
    return new ValidationError("Referenced resource does not exist", {
      code: "INVALID_REFERENCE",
      cause: err,
    });
  }

  return undefined;
}

/** Global error handler. Register before the routes. */
export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err: FastifyError, request, reply) => {
    if(isDevelopment())
    // Fastify's own JSON-schema validation (request body/params/querystring).
    if (err.validation) {
      return reply.code(400).send({
        error: "BadRequestError",
        code: "BAD_REQUEST",
        message: err.message,
        details: err.validation,
      });
    }

    const appError = toAppError(err);
    if (appError) {
      if (appError.statusCode >= 500) request.log.error({ err }, "request failed");
      return reply.code(appError.statusCode).send(appError.toJSON());
    }

    // Other Fastify errors with a 4xx status (bad JSON, 404 payload too large, ...).
    if (err.statusCode && err.statusCode < 500) {
      return reply.code(err.statusCode).send({
        error: err.name,
        code: err.code,
        message: err.message,
      });
    }

    // Unknown: log everything, leak nothing.
    request.log.error({ err }, "unhandled error");
    return reply.code(500).send({
      error: "InternalError",
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });
  });

  app.setNotFoundHandler((request, reply) =>
    reply.code(404).send({
      error: "NotFoundError",
      code: "NOT_FOUND",
      message: `Route ${request.method} ${request.url} not found`,
    }),
  );
}
