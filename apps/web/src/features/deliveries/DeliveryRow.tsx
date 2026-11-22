import type { ReactNode } from "react";

import type { DeliveryResponse } from "../../lib/api/index.ts";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge.tsx";

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function Time({ value }: { value: string }) {
  return <time dateTime={value}>{dateTimeFormat.format(new Date(value))}</time>;
}

/** One line saying how the delivery stands, in plain words. */
function Outcome({ delivery }: { delivery: DeliveryResponse }) {
  const code = delivery.responseCode ? `HTTP ${delivery.responseCode}` : null;
  const attempts = `${delivery.attempts} ${delivery.attempts === 1 ? "attempt" : "attempts"}`;

  switch (delivery.status) {
    case "pending":
      return <>Waiting to be sent</>;
    case "success":
      return (
        <>
          Delivered {delivery.deliveredAt && <Time value={delivery.deliveredAt} />}
          {code && ` · ${code}`}
        </>
      );
    case "failed":
      return (
        <>
          Attempt {delivery.attempts} failed{code && ` (${code})`}
          {delivery.nextAttemptAt && (
            <>
              {" · next try "}
              <Time value={delivery.nextAttemptAt} />
            </>
          )}
        </>
      );
    case "dead_lettered":
      return (
        <>
          Gave up after {attempts}
          {delivery.errorMessage && ` · ${delivery.errorMessage}`}
        </>
      );
  }
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1.5 text-sm text-slate-800">{children}</dd>
    </div>
  );
}

/** Scrollable on narrow screens, so it needs to be reachable by keyboard. */
function Code({ label, children }: { label: string; children: string }) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800 focus-visible:outline-2 focus-visible:outline-brand-600"
    >
      {children}
    </pre>
  );
}

export function DeliveryRow({ delivery }: { delivery: DeliveryResponse }) {
  // Response bodies are cut off at 2,000 characters when stored.
  const bodyTruncated = (delivery.responseBody?.length ?? 0) >= 2000;

  return (
    <li>
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
          <svg
            className="mt-1 size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <p className="min-w-0 font-mono text-sm font-semibold break-all text-slate-900">
                {delivery.eventType}
              </p>
              <DeliveryStatusBadge status={delivery.status} />
            </div>
            <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
              Event created <Time value={delivery.eventCreatedAt} />
              {" · "}
              <Outcome delivery={delivery} />
            </p>
          </div>
        </summary>

        <dl className="space-y-5 border-t border-slate-100 bg-white px-5 py-5 pl-12">
          <Detail label="Payload sent">
            <Code label="Payload sent">{JSON.stringify(delivery.payload, null, 2)}</Code>
          </Detail>

          <Detail label="Latest attempt">
            <p>
              {delivery.attempts} {delivery.attempts === 1 ? "attempt" : "attempts"} so far
              {delivery.responseCode
                ? ` · HTTP ${delivery.responseCode}`
                : " · no response received"}
            </p>
            {delivery.errorMessage && (
              <p className="mt-1 text-red-700">Error: {delivery.errorMessage}</p>
            )}
            {delivery.responseBody && (
              <div className="mt-2">
                <Code label="Response body">{delivery.responseBody}</Code>
                {bodyTruncated && (
                  <p className="mt-1 text-xs text-slate-500">
                    Only the first 2,000 characters are kept.
                  </p>
                )}
              </div>
            )}
          </Detail>

          <Detail label="IDs">
            <p className="font-mono text-xs break-all text-slate-600">Event {delivery.eventId}</p>
            <p className="mt-1 font-mono text-xs break-all text-slate-600">
              Delivery {delivery.id}
            </p>
          </Detail>
        </dl>
      </details>
    </li>
  );
}
