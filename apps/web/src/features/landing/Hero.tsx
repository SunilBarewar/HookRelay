import { ButtonLink } from "../../components/ui/Button.tsx";
import { DeliveryPreview } from "./DeliveryPreview.tsx";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/2 size-[48rem] -translate-x-1/2 rounded-full bg-brand-100/70 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:py-28">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-6xl sm:leading-[1.05]">
            Reliable webhook delivery, without the plumbing.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Publish an event once. HookRelay signs it, delivers it to every subscribed endpoint,
            retries failures, and records every attempt.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/signup" size="lg">
              Create an account
            </ButtonLink>
            <ButtonLink to="/login" size="lg" variant="secondary">
              Log in
            </ButtonLink>
          </div>
        </div>

        <DeliveryPreview />
      </div>
    </section>
  );
}
