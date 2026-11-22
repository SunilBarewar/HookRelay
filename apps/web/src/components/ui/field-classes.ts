import { cx } from "../../lib/cx.ts";

/** Shared look of text inputs and textareas. */
export function fieldClasses(hasError: boolean) {
  return cx(
    "block w-full rounded-lg border bg-white px-3.5 text-[15px] text-slate-900 shadow-sm transition-colors",
    "placeholder:text-slate-400 focus:outline-none focus:ring-4",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-slate-300 hover:border-slate-400 focus:border-brand-600 focus:ring-brand-500/20",
  );
}
