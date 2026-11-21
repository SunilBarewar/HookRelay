import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { Context } from "hono";

import { verifySignature } from "./verify-signature.ts";

const PORT = Number(process.env.PORT ?? 4000);
// /flaky fails this many times in a row, then succeeds (and the cycle restarts).
const FLAKY_FAILURES = Number(process.env.FLAKY_FAILURES ?? 2);

// The endpoint's signing secret (whsec_...), returned once when the endpoint is created.
// When unset, requests are accepted without verification.
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const app = new Hono();

// Verify every delivery before any route runs.
app.use("*", async (c, next) => {
  if (!WEBHOOK_SECRET) return next();

  const check = verifySignature({
    secret: WEBHOOK_SECRET,
    rawBody: await c.req.text(),
    timestampHeader: c.req.header("x-hookrelay-timestamp"),
    signatureHeader: c.req.header("x-hookrelay-signature"),
  });

  if (!check.valid) {
    console.log(`\n[receiver] REJECTED ${c.req.method} ${c.req.path}: ${check.reason}`);
    return c.json({ error: "invalid signature" }, 401);
  }

  console.log(`\n[receiver] signature verified for ${c.req.path}`);
  return next();
});

async function logRequest(c: Context, label: string) {
  const body = await c.req.text();
  console.log(`\n[receiver] ${label}`);
  console.log("headers:", Object.fromEntries(c.req.raw.headers));
  console.log("body:", body);
}

// Happy path: always 200.
app.post("/webhook", async (c) => {
  await logRequest(c, "POST /webhook");
  return c.json({ received: true });
});

// Respond with whatever status you ask for, e.g. /status/500.
app.post("/status/:code", async (c) => {
  const code = Number(c.req.param("code"));

  if (!Number.isInteger(code) || code < 200 || code > 599) {
    return c.json({ error: "code must be an integer between 200 and 599" }, 400);
  }

  await logRequest(c, `POST /status/${code}`);
  return c.body(null, code as 200);
});

// Wait before responding, e.g. /slow/10000, to exercise delivery timeouts.
app.post("/slow/:ms", async (c) => {
  const ms = Number(c.req.param("ms"));

  if (!Number.isInteger(ms) || ms < 0 || ms > 120_000) {
    return c.json({ error: "ms must be an integer between 0 and 120000" }, 400);
  }

  await logRequest(c, `POST /slow/${ms}`);
  await new Promise((resolve) => setTimeout(resolve, ms));
  return c.json({ received: true, delayedMs: ms });
});

// Fails FLAKY_FAILURES times with 500, then succeeds, to exercise retries recovering.
let flakyCalls = 0;
app.post("/flaky", async (c) => {
  flakyCalls += 1;
  const succeed = flakyCalls > FLAKY_FAILURES;

  await logRequest(c, `POST /flaky (call ${flakyCalls}, ${succeed ? "ok" : "failing"})`);

  if (!succeed) {
    return c.json({ error: "flaky failure" }, 500);
  }

  flakyCalls = 0;
  return c.json({ received: true });
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`[receiver] listening on http://localhost:${info.port}`);
  console.log(
    WEBHOOK_SECRET
      ? "[receiver] verifying signatures"
      : "[receiver] WEBHOOK_SECRET not set, NOT verifying signatures",
  );
});
