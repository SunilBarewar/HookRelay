import { Button } from "../../components/ui/Button.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { errorMessage } from "../../lib/api/index.ts";
import { ApplicationRow } from "./ApplicationRow.tsx";
import { ApplicationsSkeleton } from "./ApplicationsSkeleton.tsx";
import { useApplications } from "./hooks.ts";

const stackIcon = (
  <svg
    className="size-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
);

export function ApplicationsPage() {
  const applications = useApplications();

  return (
    <>
      <title>Applications · HookRelay</title>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Applications</h1>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-6 text-slate-600">
          An application groups the endpoints and events for one product or environment.
        </p>
      </div>

      {applications.isPending && <ApplicationsSkeleton />}

      {applications.isError && (
        <div
          role="alert"
          className="flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-red-900">We couldn’t load your applications</p>
            <p className="mt-1 text-sm text-red-800">{errorMessage(applications.error)}</p>
          </div>
          <Button
            variant="secondary"
            loading={applications.isFetching}
            onClick={() => void applications.refetch()}
          >
            {applications.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      )}

      {applications.isSuccess &&
        (applications.data.length === 0 ? (
          <EmptyState
            icon={stackIcon}
            title="No applications yet"
            description="Applications you create will be listed here, with the newest first."
          />
        ) : (
          <section aria-label="Your applications">
            <p className="mb-3 text-sm text-slate-500">
              {applications.data.length}{" "}
              {applications.data.length === 1 ? "application" : "applications"}
            </p>
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {applications.data.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </ul>
          </section>
        ))}
    </>
  );
}
