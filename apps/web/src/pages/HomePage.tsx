import { Logo } from "../components/ui/Logo.tsx";
import { Button } from "../components/ui/Button.tsx";
import { useLogout, useSession } from "../features/auth/hooks.ts";

/** Placeholder until the applications screens are built. */
export function HomePage() {
  const session = useSession();
  const logout = useLogout();

  return (
    <div className="min-h-svh">
      <title>HookRelay</title>
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-600 sm:inline">{session.data?.email}</span>
          <Button variant="secondary" loading={logout.isPending} onClick={() => logout.mutate()}>
            {logout.isPending ? "Logging out…" : "Log out"}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">You’re logged in</h1>
        <p className="mt-2 text-slate-600">Your applications will appear here soon.</p>
      </main>
    </div>
  );
}
