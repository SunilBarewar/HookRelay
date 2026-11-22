import type { ComponentProps } from "react";

import { cx } from "../../lib/cx.ts";

type Tone = "default" | "danger" | "success" | "error";

type IconButtonProps = Omit<ComponentProps<"button">, "aria-label" | "title"> & {
  /** Names the action for screen readers and the hover tooltip, e.g. "Rename Billing service". */
  label: string;
  /**
   * `danger` is for destructive actions and only turns red on hover. `success` and `error` show a
   * result, so they are coloured all the time.
   */
  tone?: Tone;
};

// Each tone sets the text colour itself, so two colour classes never compete.
const tones: Record<Tone, string> = {
  default: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
  danger: "text-slate-500 hover:bg-red-50 hover:text-red-700",
  success: "text-emerald-600 hover:bg-emerald-50",
  error: "text-red-600 hover:bg-red-50",
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
        "flex size-11 items-center justify-center rounded-lg transition-colors sm:size-9",
        "focus-visible:outline-2 focus-visible:outline-brand-600",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
