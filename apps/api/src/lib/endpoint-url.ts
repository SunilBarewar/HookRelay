import { isIP } from "node:net";

import { isProduction } from "@hookrelay/shared";

const BLOCKED_HOST_SUFFIXES = [".localhost", ".local", ".internal"];

function isPrivateIPv4(ip: string): boolean {
  const [a = 0, b = 0] = ip.split(".").map(Number);

  return (
    a === 0 || // "this" network
    a === 10 || // private
    a === 127 || // loopback
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, incl. cloud metadata (169.254.169.254)
    (a === 172 && b >= 16 && b <= 31) || // private
    (a === 192 && b === 168) // private
  );
}

function isPrivateIPv6(ip: string): boolean {
  const address = ip.toLowerCase();

  if (address === "::" || address === "::1") return true;

  // IPv4-mapped: judge by the embedded IPv4 address. URL parsing normalises
  // ::ffff:10.0.0.1 to the hex form ::ffff:a00:1, so handle both spellings.
  const dotted = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted?.[1]) return isPrivateIPv4(dotted[1]);

  const hex = address.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex?.[1] && hex[2]) {
    const high = parseInt(hex[1], 16);
    const low = parseInt(hex[2], 16);
    return isPrivateIPv4(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`);
  }

  return (
    address.startsWith("fc") || // unique local fc00::/7
    address.startsWith("fd") ||
    /^fe[89ab]/.test(address) // link-local fe80::/10
  );
}

/** Literal-host check only; it does not resolve DNS, so the worker must still guard at delivery time. */
export function isLocalOrPrivateHost(hostname: string): boolean {
  // URL#hostname keeps the brackets around IPv6 literals.
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (host === "localhost" || BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    return true;
  }

  switch (isIP(host)) {
    case 4:
      return isPrivateIPv4(host);
    case 6:
      return isPrivateIPv6(host);
    default:
      return false;
  }
}

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
