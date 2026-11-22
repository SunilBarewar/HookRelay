import type { ReactNode } from "react";

import { SectionHeading } from "./SectionHeading.tsx";

const icon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-5",
  "aria-hidden": true,
} as const;

const features: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Signed deliveries",
    text: "Every request carries an HMAC-SHA256 signature and a timestamp, made with a secret unique to each endpoint, so receivers can verify it and reject replays.",
    icon: (
      <svg {...icon}>
        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Automatic retries",
    text: "A failed delivery is tried up to 5 times with exponential backoff, starting at 5 seconds. After that it is dead-lettered so you can see what failed.",
    icon: (
      <svg {...icon}>
        <path d="M20 12a8 8 0 1 1-2.5-5.8" />
        <path d="M20 4v5h-5" />
      </svg>
    ),
  },
  {
    title: "Delivery history",
    text: "Each attempt is stored with its status, response code and error, so you can answer “did it arrive?” without digging through logs.",
    icon: (
      <svg {...icon}>
        <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
      </svg>
    ),
  },
  {
    title: "Fast to publish",
    text: "Events are queued and sent by a separate worker, so publishing doesn’t wait on slow or failing receivers.",
    icon: (
      <svg {...icon}>
        <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7Z" />
      </svg>
    ),
  },
  {
    title: "Event-type routing",
    text: "Endpoints subscribe to the event types they care about, such as order.created, and receive only those.",
    icon: (
      <svg {...icon}>
        <path d="M6 3v12" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
  },
  {
    title: "Safe by default",
    text: "In production, HookRelay refuses private and local addresses and never follows redirects, so a bad endpoint URL can’t reach your internal network.",
    icon: (
      <svg {...icon}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeading
          id="features-heading"
          eyebrow="Features"
          title="Everything a webhook needs to get there"
          description="The parts you would otherwise build and babysit yourself."
        />
        <ul className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title}>
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                {feature.icon}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
