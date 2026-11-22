import { ErrorCode, ForbiddenError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { createAccount } from "./create-account.ts";
import { deleteAccountRoute } from "./delete-account.ts";
import { generateAccountApiKey } from "./generate-api-key.ts";
import { getAccount } from "./get-account.ts";
import { login } from "./login.ts";
import { getMe } from "./me.ts";
import { logout } from "./logout.ts";
import { updateAccountRoute } from "./update-account.ts";

/** Signup and login: no token needed. */
export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(createAccount);
  app.register(login);
  app.register(logout);
};

/**
 * Routes on a specific account. Registered inside the shared protected scope
 * (see routes/index.ts), so a valid JWT is already guaranteed here.
 */
export const accountProtectedRoutes: FastifyPluginAsyncZod = async (app) => {
  // Authorization: an account may only act on itself. Runs after params validation.
  app.addHook("preHandler", async (request) => {
    const { id } = request.params as { id: string };
    if (id !== request.accountId) {
      throw new ForbiddenError("You can only access your own account", {
        code: ErrorCode.FORBIDDEN,
      });
    }
  });

  app.register(getAccount);
  app.register(updateAccountRoute);
  app.register(deleteAccountRoute);
  app.register(generateAccountApiKey);
};

/** Account routes that act on the caller (no :id), so they skip the "own account" check above. */
export const accountSelfRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(getMe);
};
