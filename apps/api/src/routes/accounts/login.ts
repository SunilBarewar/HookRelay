import { findAccountByEmail } from "@hookrelay/db";
import { ErrorCode, HttpStatus, UnauthorizedError } from "@hookrelay/shared";
import bcrypt from "bcrypt";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { signAccountToken } from "@/lib/jwt.ts";
import { ErrorResponse } from "@/schemas/error.ts";
import { AuthResponse, CredentialsBody } from "./accounts-schemas.ts";
import { verifyPassword } from "@/lib/password.ts";

// Compared against when the email is unknown so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("hookrelay-dummy-password", 10);

export const login: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/login",
    {
      schema: {
        tags: ["accounts"],
        summary: "Log in and receive a JWT (valid for 7 days)",
        body: CredentialsBody,
        response: {
          [HttpStatus.OK]: AuthResponse,
          [HttpStatus.UNAUTHORIZED]: ErrorResponse,
          [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const account = await findAccountByEmail(email);
      const valid = await verifyPassword(password, account?.password ?? DUMMY_HASH);

      if (!account || !valid) {
        throw new UnauthorizedError("Invalid email or password", { code: ErrorCode.UNAUTHORIZED });
      }

      const token = await signAccountToken(account.id);

      return reply.code(HttpStatus.OK).send({ message: "Logged in!", email, token });
    },
  );
};
