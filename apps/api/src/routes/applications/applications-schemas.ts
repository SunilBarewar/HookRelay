import type { Application } from "@hookrelay/db";
import { z } from "zod";

export const CreateApplicationBody = z.object({
  name: z.string().trim().min(1).max(255),
});

export const UpdateApplicationBody = z.object({
  name: z.string().trim().min(1).max(255),
});

export const IdParams = z.object({ id: z.uuid() });

export const MessageResponse = z.object({ message: z.string() });

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
