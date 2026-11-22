import type { Account } from "@hookrelay/db";
import type { AccountResponse } from "@hookrelay/shared/schemas";

export function toAccountResponse(account: Account): AccountResponse {
  return {
    id: account.id,
    email: account.email,
    hasApiKey: account.apiKeyHash !== null,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}
