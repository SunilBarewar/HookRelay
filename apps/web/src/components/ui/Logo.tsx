import { cx } from "../../lib/cx.ts";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={cx("size-8", className)} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-brand-600" />
      <path
        d="M10 22v-6a5 5 0 0 1 5-5h7"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="11" r="2.5" fill="#fff" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cx(
          "text-lg font-semibold tracking-tight",
          tone === "light" ? "text-white" : "text-slate-900",
        )}
      >
        HookRelay
      </span>
    </span>
  );
}
