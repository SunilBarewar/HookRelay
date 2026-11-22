import { cx } from "../../lib/cx.ts";
import type { DeliveryStatus } from "../../lib/api/index.ts";

const styles: Record<DeliveryStatus, { label: string; badge: string; dot: string }> = {
  pending: { label: "Pending", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  success: { label: "Delivered", badge: "bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  // `failed` means an attempt failed and another is scheduled.
  failed: { label: "Retrying", badge: "bg-amber-50 text-amber-900", dot: "bg-amber-500" },
  dead_lettered: { label: "Dead-lettered", badge: "bg-red-50 text-red-800", dot: "bg-red-500" },
};

/** Text plus a dot, so the state never relies on colour alone. */
export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
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
