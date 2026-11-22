import { z } from "zod";

/** Body for both creating an account and logging in. */
export const CredentialsBody = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export type CredentialsBody = z.infer<typeof CredentialsBody>;

/** Response for both creating an account and logging in. The token is set as an httpOnly cookie. */
export const AuthResponse = z.object({
  message: z.string(),
  email: z.email(),
});
export type AuthResponse = z.infer<typeof AuthResponse>;

/** Never includes the password hash or API key hash. */
export const AccountResponse = z.object({
  id: z.uuid(),
  email: z.email(),
  hasApiKey: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type AccountResponse = z.infer<typeof AccountResponse>;

export const UpdateAccountBody = z
  .object({
    email: z.email().optional(),
    password: z.string().min(8).optional(),
  })
  .refine((body) => body.email !== undefined || body.password !== undefined, {
    message: "Provide at least one of: email, password",
  });
export type UpdateAccountBody = z.infer<typeof UpdateAccountBody>;

export const ApiKeyResponse = z.object({
  message: z.string(),
  apiKey: z.string(),
});
export type ApiKeyResponse = z.infer<typeof ApiKeyResponse>;
