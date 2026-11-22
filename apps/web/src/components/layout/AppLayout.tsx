import { Link, Outlet } from "react-router";

import { Button } from "../ui/Button.tsx";
import { Logo } from "../ui/Logo.tsx";
import { useLogout, useSession } from "../../features/auth/hooks.ts";
import { paths } from "../../routes/paths.ts";

/** Frame for every logged-in screen: header with the account and a log out button. */
export function AppLayout() {
  const session = useSession();
  const logout = useLogout();

  return (
    <div className="min-h-svh bg-slate-50/40">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
          <Link to={paths.applications} aria-label="HookRelay applications" className="rounded-md">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden max-w-56 truncate text-sm text-slate-600 sm:inline">
              {session.data?.email}
            </span>
            <Button variant="secondary" loading={logout.isPending} onClick={() => logout.mutate()}>
              {logout.isPending ? "Logging out…" : "Log out"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
