# @hookrelay/sdk

JavaScript/TypeScript client for the HookRelay API.

HookRelay delivers webhooks for you. Your app sends an event, and HookRelay signs it, sends it to
every endpoint subscribed to that event type, and retries if delivery fails. This SDK lets you do
that from your own code with an API key, instead of calling the HTTP API by hand.

Use it to:

- create applications and register the endpoints that should receive your events
- publish events such as `order.created`, with any JSON payload
- verify the signature on incoming webhooks in your receiving server

## Usage

```ts
import { HookRelay, HookRelayError } from "@hookrelay/sdk";

const hr = new HookRelay(process.env.HOOKRELAY_API_KEY!);

// Pointing at a local API (http://localhost:8000):

const app = await hr.applications.create({ name: "My App" });

const endpoint = await hr.endpoints.create(app.id, {
  url: "https://example.com/webhooks",
  eventTypes: ["order.created"],
});
// endpoint.signingSecret is returned only once: store it.

await hr.events.create(app.id, { eventType: "order.created", payload: { orderId: 42 } });

try {
  await hr.applications.delete("missing-id");
} catch (err) {
  if (err instanceof HookRelayError) console.log(err.status, err.code, err.message);
}
```

## Verifying webhooks

```ts
import { verifyWebhookSignature } from "@hookrelay/sdk/webhooks";

const result = verifyWebhookSignature({
  secret: process.env.HOOKRELAY_SIGNING_SECRET!, // whsec_...
  rawBody, // the exact raw request body string
  timestampHeader: req.headers["x-hookrelay-timestamp"],
  signatureHeader: req.headers["x-hookrelay-signature"],
});
if (!result.valid) return res.status(401).send(result.reason);
```
