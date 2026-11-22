import { cx } from "../../lib/cx.ts";

type Tone = "success" | "warning" | "danger";

interface Delivery {
  eventType: string;
  endpoint: string;
  status: string;
  tone: Tone;
  detail: string;
}

// Illustrative only: shows the delivery states the product records, not real traffic.
const deliveries: Delivery[] = [
  {
    eventType: "order.created",
    endpoint: "https://example.com/webhooks",
    status: "Delivered",
    tone: "success",
    detail: "200 OK on attempt 1",
  },
  {
    eventType: "order.created",
    endpoint: "https://staging.example.com/hooks",
    status: "Retrying",
    tone: "warning",
    detail: "Attempt 2 of 5, next try in 10 seconds",
  },
  {
    eventType: "invoice.paid",
    endpoint: "https://example.com/billing",
    status: "Dead-lettered",
    tone: "danger",
    detail: "Still failing after 5 attempts",
  },
];

const tones: Record<Tone, { badge: string; dot: string }> = {
  success: { badge: "bg-emerald-400/10 text-emerald-300", dot: "bg-emerald-400" },
  warning: { badge: "bg-amber-400/10 text-amber-300", dot: "bg-amber-400" },
  danger: { badge: "bg-red-400/10 text-red-300", dot: "bg-red-400" },
};

export function DeliveryPreview() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-brand-600/20">
      <figcaption className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <span className="text-sm font-semibold text-white">Deliveries</span>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-300">
          Example
        </span>
      </figcaption>

      <ul className="divide-y divide-white/10">
        {deliveries.map((delivery) => {
          const tone = tones[delivery.tone];
          return (
            <li key={delivery.endpoint} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium text-white">{delivery.eventType}</p>
                  <p className="mt-0.5 truncate text-[13px] text-slate-400">{delivery.endpoint}</p>
                </div>
                <span
                  className={cx(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                    tone.badge,
                  )}
                >
                  <span aria-hidden="true" className={cx("size-1.5 rounded-full", tone.dot)} />
                  {delivery.status}
                </span>
              </div>
              <p className="mt-2 text-[13px] text-slate-500">{delivery.detail}</p>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
