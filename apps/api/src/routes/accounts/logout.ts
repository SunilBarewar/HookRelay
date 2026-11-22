import { HttpStatus } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { clearAuthCookie } from "@/lib/auth-cookie.ts";
import { MessageResponse } from "./accounts-schemas.ts";

export const logout: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/logout",
    {
      schema: {
        tags: ["accounts"],
        summary: "Log out by clearing the auth cookie",
        response: { [HttpStatus.OK]: MessageResponse },
      },
    },
    async (_request, reply) => {
      clearAuthCookie(reply);
      return { message: "Logged out" };
    },
  );
};
