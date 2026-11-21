# @hookrelay/sdk

JavaScript/TypeScript client for the HookRelay API. Zero dependencies, uses the built-in `fetch` (Node 20+).

```bash
npm install @hookrelay/sdk
```

## Usage

```ts
import { HookRelay, HookRelayError } from "@hookrelay/sdk";

const hr = new HookRelay(process.env.HOOKRELAY_API_KEY!, {
  baseUrl: "https://api.yourdomain.com", // optional
});

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

## Verifying webhooks (receiver side)

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

## Development

```bash
pnpm test --project @hookrelay/sdk   # from the repo root
pnpm --filter @hookrelay/sdk build
```
