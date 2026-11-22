import { cx } from "../../lib/cx.ts";
import type { EndpointStatus } from "../../lib/api/index.ts";

const styles: Record<EndpointStatus, { label: string; badge: string; dot: string }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  disabled: { label: "Disabled", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
};

/** Text plus a dot, so the state never relies on colour alone. */
export function StatusBadge({ status }: { status: EndpointStatus }) {
  const { label, badge, dot } = styles[status];

  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        badge,
      )}
    >
      <span aria-hidden="true" className={cx("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
