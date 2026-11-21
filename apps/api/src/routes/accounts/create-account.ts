import { findAccountByEmail, insertAccount } from "@hookrelay/db";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { signAccountToken } from "@/lib/jwt.ts";
import { hashPassword } from "@/lib/password.ts";
import { ErrorResponse } from "@/schemas/error.ts";
import { AuthResponse, CredentialsBody } from "./accounts-schemas.ts";
import { ConflictError, ErrorCode, HttpStatus } from "@hookrelay/shared";

export const createAccount: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/register",
    {
      schema: {
        tags: ["accounts"],
        summary: "Create an account",
        body: CredentialsBody,
        response: {
          [HttpStatus.OK]: AuthResponse,
          [HttpStatus.CONFLICT]: ErrorResponse,
          [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const existingAccount = await findAccountByEmail(email);

      if (existingAccount) {
        throw new ConflictError("Account already exists", { code: ErrorCode.ALREADY_EXISTS });
      }

      const hashedPassword = await hashPassword(password);

      const account = await insertAccount({ email, password: hashedPassword });
      const token = await signAccountToken(account.id);

      return reply.code(HttpStatus.OK).send({ message: "Account created!", email, token });
    },
  );
};
