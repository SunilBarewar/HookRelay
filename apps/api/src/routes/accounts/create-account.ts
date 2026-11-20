import { findAccountByEmail, insertAccount } from "@hookrelay/db";
import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { ErrorResponse } from "@/schemas/error.ts";
import { CreateAccountBody, CreateAccountResponse } from "./accounts-schemas.ts";
import { ConflictError, ErrorCode, HttpStatus } from "@hookrelay/shared";

const SALT_ROUNDS = 10;

export function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        tags: ["accounts"],
        summary: "Create an account",
        body: CreateAccountBody,
        response: {
          [HttpStatus.OK]: CreateAccountResponse,
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

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      await insertAccount({ email, password: hashedPassword });

      return reply.code(HttpStatus.OK).send({ message: "Account created!", email });
    },
  );
}
