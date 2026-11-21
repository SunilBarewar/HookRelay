# Webhook receiver

A tiny [Hono](https://hono.dev) server that stands in for a customer's webhook URL, so you can test HookRelay deliveries locally. It logs every request (headers and body) to the console.

## Run it

From the repo root:

```bash
pnpm --filter @hookrelay/example-webhook-receiver dev
```

It listens on `http://localhost:4000`. Set `PORT` to change that.

## Routes

All routes accept `POST`.

| Route           | Behaviour                                                       | Use it to test            |
| --------------- | --------------------------------------------------------------- | ------------------------- |
| `/webhook`      | Always responds `200`.                                          | The happy path            |
| `/status/:code` | Responds with the given status (200–599). Anything else is 400. | Retries on a given status |
| `/slow/:ms`     | Waits `ms` milliseconds (max 120000), then responds `200`.      | Delivery timeouts         |
| `/flaky`        | Responds `500` for the first N calls, then `200`, then repeats. | Retries that recover      |

`N` for `/flaky` defaults to `2`. Override it with `FLAKY_FAILURES`:

```bash
FLAKY_FAILURES=4 pnpm --filter @hookrelay/example-webhook-receiver dev
```

## Try it with HookRelay

1. Start Redis and Postgres (`docker compose up -d`), then the API and worker (`pnpm dev:api`, `pnpm dev:worker`).
2. Register an endpoint whose URL points at this server, for example `http://localhost:4000/flaky`, subscribed to an event type such as `order.created`.
3. Create an event of that type through the API.
4. Watch this server's console for the incoming deliveries, and the worker's console for the results and retries.

## Try it without HookRelay

```bash
curl -X POST http://localhost:4000/webhook \
  -H 'content-type: application/json' \
  -d '{"hello":"world"}'
```

## Verify signatures

Every delivery is signed. Set the `WEBHOOK_SECRET` environment variable to the endpoint's signing secret (the `whsec_...` value returned once when the endpoint is created) and restart. The receiver then rejects anything that isn't validly signed with `401`.

Without `WEBHOOK_SECRET` the receiver accepts everything and says so on startup.

Each delivery carries these headers:

| Header                  | Meaning                                   |
| ----------------------- | ----------------------------------------- |
| `x-hookrelay-signature` | Hex HMAC-SHA256 of `${timestamp}.${body}` |
| `x-hookrelay-timestamp` | Unix time in seconds when it was signed   |
| `x-hookrelay-event-id`  | The event that triggered this delivery    |

To verify (see [src/verify-signature.ts](src/verify-signature.ts), which uses only `node:crypto`):

1. Use the **raw** request body, exactly as received. Re-serializing the parsed JSON can change the bytes and break the signature.
2. Compute `HMAC-SHA256(secret, "<timestamp>.<raw body>")` as hex.
3. Compare it with `x-hookrelay-signature` in constant time (`timingSafeEqual`).
4. Reject timestamps more than a few minutes from now, so a captured request can't be replayed.
