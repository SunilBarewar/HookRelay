import { SectionHeading } from "./SectionHeading.tsx";

const steps = [
  {
    title: "Create an application",
    text: "An application groups the endpoints and events for one product or environment.",
  },
  {
    title: "Add endpoints",
    text: "Register the URLs that should receive webhooks and choose which event types each one wants.",
  },
  {
    title: "Publish an event",
    text: "Send an event type and any JSON payload through the API or the SDK. The call returns right away.",
  },
  {
    title: "HookRelay delivers it",
    text: "Each subscribed endpoint gets a signed request. Failures are retried, and every attempt is recorded.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="mx-auto max-w-6xl scroll-mt-16 px-6 py-20 sm:py-24"
    >
      <SectionHeading
        id="how-heading"
        eyebrow="How it works"
        title="From one API call to every endpoint"
      />
      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t-2 border-slate-900 pt-5">
            <p className="font-mono text-sm font-medium text-brand-600">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
