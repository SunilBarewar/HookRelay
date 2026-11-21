import { isLocalOrPrivateHost, isProduction } from "@hookrelay/shared";

/**
 * Hosted (production): https only, and no localhost/private hosts.
 * Everywhere else (local dev, test): any http(s) URL, so a local receiver works.
 * Returns an error message, or null when the URL is acceptable.
 */
export function getEndpointUrlError(value: string): string | null {
  if (!isProduction()) return null;

  const url = new URL(value);

  if (url.protocol !== "https:") return "Endpoint URL must use https";
  if (isLocalOrPrivateHost(url.hostname)) {
    return "Endpoint URL must not point to localhost or a private network";
  }

  return null;
}
