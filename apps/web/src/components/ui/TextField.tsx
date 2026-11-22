import { useId, type ComponentProps, type ReactNode } from "react";

import { cx } from "../../lib/cx.ts";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  /** Format or purpose hint, shown until there is an error to show instead. */
  hint?: string;
  error?: string;
  /** Control rendered inside the right edge of the input, e.g. a show/hide button. */
  trailing?: ReactNode;
};

export function TextField({ label, hint, error, trailing, className, ...input }: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error ?? hint);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cx(
            "block h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] text-slate-900 shadow-sm transition-colors",
            "placeholder:text-slate-400 focus:outline-none focus:ring-4",
            Boolean(trailing) && "pr-11",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
              : "border-slate-300 hover:border-slate-400 focus:border-brand-600 focus:ring-brand-500/20",
          )}
          {...input}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center">{trailing}</div>}
      </div>
      {hasMessage && (
        <p
          id={messageId}
          className={cx(
            "mt-1.5 flex items-start gap-1.5 text-[13px] leading-5",
            error ? "text-red-700" : "text-slate-500",
          )}
        >
          {error && (
            <svg
              className="mt-0.5 size-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{error ?? hint}</span>
        </p>
      )}
    </div>
  );
}
