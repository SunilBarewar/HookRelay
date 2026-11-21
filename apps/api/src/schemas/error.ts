import { HttpStatus } from "@hookrelay/shared";
import { z } from "zod";

/** Shape produced by the global error handler (see plugins/error-handler.ts). */
export const ErrorResponse = z.object({
  error: z.string(),
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

/** Responses every protected route can return. */
export const protectedErrorResponses = {
  [HttpStatus.UNAUTHORIZED]: ErrorResponse,
};

/** Responses for routes that act on a specific application. */
export const applicationErrorResponses = {
  ...protectedErrorResponses,
  [HttpStatus.NOT_FOUND]: ErrorResponse,
};
