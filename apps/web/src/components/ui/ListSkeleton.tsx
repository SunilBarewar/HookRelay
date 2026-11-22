interface ListSkeletonProps {
  /** Announced to screen readers while the list loads, e.g. "Loading your applications…". */
  label: string;
}

export function ListSkeleton({ label }: ListSkeletonProps) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <ul
        aria-hidden="true"
        className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white"
      >
        {[0, 1, 2].map((row) => (
          <li key={row} className="flex items-center justify-between gap-6 px-5 py-4">
            <div className="space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="hidden h-3 w-64 animate-pulse rounded bg-slate-100 sm:block" />
          </li>
        ))}
      </ul>
    </div>
  );
}
