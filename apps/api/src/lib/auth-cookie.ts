import { isDevelopment } from "@hookrelay/shared";
import type { FastifyReply } from "fastify";

export const AUTH_COOKIE = "hookrelay_token";

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

// httpOnly keeps the JWT out of reach of page scripts; SameSite=Lax stops other sites from
// sending it on cross-site POST/PATCH/DELETE requests (CSRF).
const baseOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: !isDevelopment(),
  path: "/",
} as const;

export function setAuthCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(AUTH_COOKIE, token, { ...baseOptions, maxAge: SEVEN_DAYS_SECONDS });
}

export function clearAuthCookie(reply: FastifyReply): void {
  reply.clearCookie(AUTH_COOKIE, baseOptions);
}
