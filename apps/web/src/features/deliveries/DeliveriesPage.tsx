import { Link, useParams } from "react-router";

import { ButtonLink } from "../../components/ui/Button.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { ErrorAlert } from "../../components/ui/ErrorAlert.tsx";
import { ListSkeleton } from "../../components/ui/ListSkeleton.tsx";
import { errorMessage } from "../../lib/api/index.ts";
import { applicationPath, paths } from "../../routes/paths.ts";
import { useApplications } from "../applications/hooks.ts";
import { StatusBadge } from "../endpoints/StatusBadge.tsx";
import { useEndpoints } from "../endpoints/hooks.ts";
import { DeliveryList } from "./DeliveryList.tsx";

function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <Link
        to={to}
        className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <span aria-hidden="true">←</span> {children}
      </Link>
    </nav>
  );
}

/** One endpoint and the events delivered to it. */
export function DeliveriesPage() {
  const { applicationId = "", endpointId = "" } = useParams();
  const applications = useApplications();
  const application = applications.data?.find((candidate) => candidate.id === applicationId);
  const endpoints = useEndpoints(applicationId, Boolean(application));
  const endpoint = endpoints.data?.find((candidate) => candidate.id === endpointId);

  const backTo = application ? applicationPath(application.id) : paths.applications;
  const backLabel = application ? application.name : "Applications";

  if (applications.isPending || (application && endpoints.isPending)) {
    return (
      <>
        <BackLink to={backTo}>{backLabel}</BackLink>
        <ListSkeleton label="Loading endpoint…" />
      </>
    );
  }

  const failed = applications.isError ? applications : endpoints.isError ? endpoints : null;
  if (failed) {
    return (
      <>
        <BackLink to={backTo}>{backLabel}</BackLink>
        <ErrorAlert
          title="We couldn’t load this endpoint"
          message={errorMessage(failed.error)}
          retrying={failed.isFetching}
          onRetry={() => void failed.refetch()}
        />
      </>
    );
  }

  if (!application || !endpoint) {
    return (
      <>
        <title>Endpoint not found · HookRelay</title>
        <BackLink to={backTo}>{backLabel}</BackLink>
        <EmptyState
          title="Endpoint not found"
          description="It may have been deleted, or the link may be wrong."
          action={<ButtonLink to={backTo}>Back to {backLabel}</ButtonLink>}
        />
      </>
    );
  }

  return (
    <>
      <title>{`Events · ${endpoint.url} · HookRelay`}</title>
      <BackLink to={backTo}>{backLabel}</BackLink>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="min-w-0 text-xl font-semibold tracking-tight break-all text-slate-900 sm:text-2xl">
            {endpoint.url}
          </h1>
          <StatusBadge status={endpoint.status} />
        </div>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-6 text-slate-600">
          The events delivered to this endpoint, newest first. Open one to see what was sent and how
          the delivery went.
        </p>
      </div>

      <DeliveryList endpoint={endpoint} />
    </>
  );
}
