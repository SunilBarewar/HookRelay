import { Navigate, Outlet } from "react-router";

import { Button } from "../components/ui/Button.tsx";
import { Spinner } from "../components/ui/Spinner.tsx";
import { useSession } from "../features/auth/hooks.ts";
import { paths } from "./paths.ts";

function FullPageStatus({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center text-slate-600">
      {children}
    </div>
  );
}

function CheckingSession() {
  return (
    <FullPageStatus>
      <div role="status" className="flex items-center gap-2.5 text-sm">
        <Spinner className="size-5 text-brand-600" />
        <span>Checking your session…</span>
      </div>
    </FullPageStatus>
  );
}

/** Login and signup: logged-in visitors are sent to the app instead. */
export function GuestOnly() {
  const session = useSession();

  if (session.isPending) return <CheckingSession />;
  if (session.data) return <Navigate to={paths.applications} replace />;
  return <Outlet />;
}

/** Everything inside the app: logged-out visitors are sent to log in. */
export function RequireAuth() {
  const session = useSession();

  if (session.isPending) return <CheckingSession />;

  if (session.isError) {
    return (
      <FullPageStatus>
        <p className="max-w-sm text-sm">
          We couldn’t reach HookRelay to check your session. Check your connection and try again.
        </p>
        <Button variant="secondary" onClick={() => void session.refetch()}>
          Try again
        </Button>
      </FullPageStatus>
    );
  }

  if (!session.data) return <Navigate to={paths.login} replace />;
  return <Outlet />;
}
