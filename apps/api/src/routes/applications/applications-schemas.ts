import type { Application } from "@hookrelay/db";
import { HttpStatus } from "@hookrelay/shared";
import { z } from "zod";

import { ErrorResponse } from "@/schemas/error.ts";

export const CreateApplicationBody = z.object({
  name: z.string().trim().min(1).max(255),
});

export const ApplicationResponse = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export function toApplicationResponse(app: Application): z.infer<typeof ApplicationResponse> {
  return {
    id: app.id,
    name: app.name,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  };
}

/** Shown as a lock icon / "Authorize" box in the OpenAPI docs. */
export const security = [{ bearerAuth: [] }];

export const protectedErrorResponses = {
  [HttpStatus.UNAUTHORIZED]: ErrorResponse,
};
