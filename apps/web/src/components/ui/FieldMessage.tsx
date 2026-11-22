import { cx } from "../../lib/cx.ts";

interface FieldMessageProps {
  id: string;
  /** Takes the place of the hint, with an icon so it doesn't rely on colour alone. */
  error?: string;
  hint?: string;
}

/** The hint or error line under a form field. */
export function FieldMessage({ id, error, hint }: FieldMessageProps) {
  if (!error && !hint) return null;

  return (
    <p
      id={id}
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
  );
}
