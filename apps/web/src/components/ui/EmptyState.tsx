import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  /** Why it's empty and what to do next. */
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-16 text-center">
      {icon && (
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          {icon}
        </span>
      )}
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
