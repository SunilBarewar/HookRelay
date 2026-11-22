import { Link } from "react-router";

import { ButtonLink } from "../../components/ui/Button.tsx";
import { Logo } from "../../components/ui/Logo.tsx";
import { useSession } from "../auth/hooks.ts";
import { paths } from "../../routes/paths.ts";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#developers", label: "Developers" },
];

export function SiteHeader() {
  const session = useSession();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link to={paths.home} aria-label="HookRelay home" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {session.data ? (
            <ButtonLink to={paths.applications}>Open dashboard</ButtonLink>
          ) : (
            <>
              <Link
                to={paths.login}
                className="rounded-md px-2 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                Log in
              </Link>
              <ButtonLink to={paths.signup}>Get started</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
