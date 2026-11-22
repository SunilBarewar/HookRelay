import { Logo } from "../../components/ui/Logo.tsx";

const steps = [
  {
    title: "Event published",
    detail: (
      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-brand-100">
        order.created
      </code>
    ),
  },
  {
    title: "Signed and sent",
    detail: "Every request carries an HMAC-SHA256 signature your receiver can verify.",
  },
  {
    title: "Delivered, or retried",
    detail: "Failed attempts retry with exponential backoff, and each one is recorded.",
  },
];

/** Product pitch beside the auth forms. Desktop only: phones get just the form. */
export function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 size-[32rem] rounded-full bg-brand-600/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <Logo tone="light" className="relative" />

      <div className="relative my-auto max-w-md py-16">
        <h2 className="text-4xl leading-[1.15] font-semibold tracking-tight text-balance">
          Webhooks that arrive, with proof that they did.
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-300">
          Publish an event once. HookRelay signs it, delivers it to every subscribed endpoint, and
          keeps the full delivery history.
        </p>

        <ol className="mt-12 space-y-0">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-8 left-4 -ml-px h-[calc(100%-2rem)] w-px bg-white/15"
                />
              )}
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-sm font-medium text-slate-200">
                {index + 1}
              </span>
              <div className="pt-1">
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
