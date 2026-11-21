import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import { verifyWebhookSignature } from "../src/webhooks.ts";

const secret = "whsec_test";
const rawBody = JSON.stringify({ hello: "world" });
const sign = (ts: string) => createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex");
const now = () => String(Math.floor(Date.now() / 1000));

describe("verifyWebhookSignature", () => {
  it("accepts a valid signature", () => {
    const ts = now();
    expect(
      verifyWebhookSignature({ secret, rawBody, timestampHeader: ts, signatureHeader: sign(ts) }),
    ).toEqual({ valid: true });
  });

  it("rejects a tampered body", () => {
    const ts = now();
    const res = verifyWebhookSignature({
      secret,
      rawBody: rawBody + " ",
      timestampHeader: ts,
      signatureHeader: sign(ts),
    });
    expect(res.valid).toBe(false);
  });

  it("rejects stale timestamps", () => {
    const ts = String(Math.floor(Date.now() / 1000) - 3600);
    const res = verifyWebhookSignature({
      secret,
      rawBody,
      timestampHeader: ts,
      signatureHeader: sign(ts),
    });
    expect(res.valid).toBe(false);
  });

  it("rejects missing headers", () => {
    expect(
      verifyWebhookSignature({ secret, rawBody, timestampHeader: null, signatureHeader: null })
        .valid,
    ).toBe(false);
  });
});
