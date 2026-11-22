import { useId } from "react";

import { cx } from "../../lib/cx.ts";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Says what each state means. */
  description: string;
}

/** An on/off setting that takes effect when the form is saved. */
export function Switch({ checked, onChange, label, description }: SwitchProps) {
  const id = useId();

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p id={`${id}-label`} className="text-sm font-medium text-slate-700">
          {label}
        </p>
        <p id={`${id}-description`} className="mt-0.5 text-[13px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-description`}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
          checked ? "bg-brand-600" : "bg-slate-300",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
