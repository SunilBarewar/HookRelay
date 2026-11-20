import { z } from "zod";

/** Shape produced by the global error handler (see plugins/error-handler.ts). */
export const ErrorResponse = z.object({
  error: z.string(),
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});
