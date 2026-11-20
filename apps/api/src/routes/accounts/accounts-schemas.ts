import { z } from "zod";

/** Body for both creating an account and logging in. */
export const CredentialsBody = z.object({
  email: z.email(),
  password: z.string().min(8),
});

/** Response for both creating an account and logging in. */
export const AuthResponse = z.object({
  message: z.string(),
  email: z.email(),
  token: z.string(),
});
