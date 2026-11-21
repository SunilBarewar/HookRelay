import { z } from "zod";

export const successResponse = <T extends z.ZodType>(data: T) =>
  z.object({ message: z.string(), data });

export function toSuccessResponse<T>(message: string, data: T): { message: string; data: T } {
  return { message, data };
}
