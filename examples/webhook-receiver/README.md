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

## Not included yet

This receiver does not verify signatures. Once the worker signs deliveries, verification with the endpoint's `whsec_…` signing secret can be added here as a reference for customers.
