import { z } from "zod";

export const CreateAccountBody = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const CreateAccountResponse = z.object({
  message: z.string(),
  email: z.email(),
});
