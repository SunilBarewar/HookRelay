import type { ComponentProps } from "react";

import { cx } from "../../lib/cx.ts";

type IconButtonProps = Omit<ComponentProps<"button">, "aria-label" | "title"> & {
  /** Names the action for screen readers and the hover tooltip, e.g. "Rename Billing service". */
  label: string;
  tone?: "default" | "danger";
};

export function IconButton({
  label,
  tone = "default",
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "flex size-11 items-center justify-center rounded-lg text-slate-500 transition-colors sm:size-9",
        "focus-visible:outline-2 focus-visible:outline-brand-600",
        tone === "danger"
          ? "hover:bg-red-50 hover:text-red-700"
          : "hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
