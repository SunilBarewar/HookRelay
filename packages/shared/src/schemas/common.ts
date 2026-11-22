import { z } from "zod";

export const IdParams = z.object({ id: z.uuid() });
export type IdParams = z.infer<typeof IdParams>;

/** Params for routes nested under an application. */
export const ApplicationParams = z.object({ applicationId: z.uuid() });
export type ApplicationParams = z.infer<typeof ApplicationParams>;

export const MessageResponse = z.object({ message: z.string() });
export type MessageResponse = z.infer<typeof MessageResponse>;
