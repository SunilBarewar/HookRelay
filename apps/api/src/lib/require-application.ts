import { getApplicationById } from "@hookrelay/db";
import { ErrorCode, NotFoundError } from "@hookrelay/shared";

/**
 * Loads an application the account owns, or throws a 404. "Missing" and "someone else's" give the
 * same answer, so ids can't be probed.
 */
export async function requireOwnedApplication(applicationId: string, accountId: string) {
  const application = await getApplicationById(applicationId);

  if (!application || application.accountId !== accountId) {
    throw new NotFoundError("Application not found", { code: ErrorCode.NOT_FOUND });
  }

  return application;
}
