import type { Application } from "@hookrelay/db";
import type { ApplicationResponse } from "@hookrelay/shared/schemas";

export function toApplicationResponse(app: Application): ApplicationResponse {
  return {
    id: app.id,
    name: app.name,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  };
}
