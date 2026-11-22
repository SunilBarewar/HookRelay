import { z } from "zod";

export const CreateApplicationBody = z.object({
  name: z.string().trim().min(1).max(255),
});
export type CreateApplicationBody = z.infer<typeof CreateApplicationBody>;

export const UpdateApplicationBody = z.object({
  name: z.string().trim().min(1).max(255),
});
export type UpdateApplicationBody = z.infer<typeof UpdateApplicationBody>;

export const ApplicationResponse = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type ApplicationResponse = z.infer<typeof ApplicationResponse>;
