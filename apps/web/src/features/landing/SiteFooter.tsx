import { Link } from "react-router";

import { Logo } from "../../components/ui/Logo.tsx";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <Logo />
        <nav aria-label="Account" className="flex gap-6 text-sm font-medium text-slate-600">
          <Link to="/login" className="hover:text-slate-900">
            Log in
          </Link>
          <Link to="/signup" className="hover:text-slate-900">
            Create an account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
