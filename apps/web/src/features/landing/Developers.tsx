import { CodeBlock } from "./CodeBlock.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

const publishExample = `import { HookRelay } from "@hookrelay/sdk";

const hr = new HookRelay(process.env.HOOKRELAY_API_KEY!);

await hr.events.create(appId, {
  eventType: "order.created",
  payload: { orderId: 42 },
});`;

const verifyExample = `import { verifyWebhookSignature } from "@hookrelay/sdk/webhooks";

const result = verifyWebhookSignature({
  secret: process.env.HOOKRELAY_SIGNING_SECRET!,
  rawBody,
  timestampHeader: req.headers["x-hookrelay-timestamp"],
  signatureHeader: req.headers["x-hookrelay-signature"],
});

if (!result.valid) return res.status(401).send(result.reason);`;

const points = [
  "Authenticate server-to-server calls with an API key.",
  "Publish events from TypeScript or JavaScript with the SDK, or call the HTTP API directly.",
  "Verify incoming webhooks with one function. It checks the signature and rejects stale timestamps.",
];

export function Developers() {
  return (
    <section
      id="developers"
      aria-labelledby="developers-heading"
      className="scroll-mt-16 bg-slate-900 text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            id="developers-heading"
            eyebrow="For developers"
            title="Publish with one call. Verify with one function."
            tone="dark"
          />
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex gap-3 leading-7 text-slate-300">
                <svg
                  className="mt-1 size-5 shrink-0 text-brand-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 space-y-5">
          <CodeBlock title="Publish an event">{publishExample}</CodeBlock>
          <CodeBlock title="Verify a delivery on your server">{verifyExample}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
