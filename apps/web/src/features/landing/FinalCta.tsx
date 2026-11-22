import { ButtonLink } from "../../components/ui/Button.tsx";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="rounded-3xl bg-brand-50 px-6 py-14 text-center ring-1 ring-brand-100 sm:px-12">
        <h2
          id="cta-heading"
          className="text-3xl font-semibold tracking-tight text-balance text-slate-900 sm:text-4xl"
        >
          Send your first webhook today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
          Create an account, add an endpoint, and publish an event. HookRelay takes it from there.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/signup" size="lg">
            Create an account
          </ButtonLink>
          <ButtonLink to="/login" size="lg" variant="secondary">
            Log in
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
