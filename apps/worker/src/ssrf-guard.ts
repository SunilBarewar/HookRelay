import { lookup } from "node:dns";
import { isLocalOrPrivateHost } from "@hookrelay/shared";
import { Agent } from "undici";

type LookupCallback = (
  error: NodeJS.ErrnoException | null,
  address: string | { address: string; family: number }[],
  family?: number,
) => void;

/**
 * DNS lookup that refuses to resolve to a local/private address. Validating at connect time
 * (rather than resolving first and fetching later) closes the DNS-rebinding window, because
 * the checked IP is the one the socket actually connects to.
 */
function guardedLookup(hostname: string, options: object, callback: LookupCallback) {
  lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error, []);

    const blocked = addresses.find((entry) => isLocalOrPrivateHost(entry.address));
    if (blocked) {
      return callback(
        new Error(`Refusing to connect to private address ${blocked.address} for ${hostname}`),
        [],
      );
    }

    callback(null, addresses);
  });
}

/**
 * Node doesn't call `lookup` for IP literals, so reject those (and localhost-style names) up front.
 * Returns an error message, or null when the URL is fine to connect to.
 */
export function getBlockedUrlError(url: string): string | null {
  const { hostname } = new URL(url);
  return isLocalOrPrivateHost(hostname)
    ? `Refusing to connect to local or private host ${hostname}`
    : null;
}

/** Production only: dev needs to reach localhost (e.g. the example receiver). */
export const guardedAgent = new Agent({ connect: { lookup: guardedLookup } });
