import type { ReactNode } from "react";

import { Logo } from "../../components/ui/Logo.tsx";
import { BrandPanel } from "./BrandPanel.tsx";

interface AuthLayoutProps {
  /** Browser tab title, e.g. "Log in". */
  pageTitle: string;
  title: string;
  description: string;
  /** Link to the other auth page, shown under the form. */
  footer: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ pageTitle, title, description, footer, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[5fr_6fr]">
      <title>{`${pageTitle} · HookRelay`}</title>
      <BrandPanel />

      <main className="flex flex-col px-6 py-8 sm:px-10">
        <Logo className="lg:hidden" />

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-[15px] leading-6 text-slate-600">{description}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-slate-600">{footer}</p>
        </div>
      </main>
    </div>
  );
}
