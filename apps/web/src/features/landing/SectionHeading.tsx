import { cx } from "../../lib/cx.ts";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  /** Use "dark" on dark backgrounds. */
  tone?: "light" | "dark";
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = "light",
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div className="max-w-2xl">
      <p className={cx("text-sm font-semibold", dark ? "text-brand-400" : "text-brand-600")}>
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cx(
          "mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
          dark ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cx("mt-4 text-lg leading-8", dark ? "text-slate-300" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
