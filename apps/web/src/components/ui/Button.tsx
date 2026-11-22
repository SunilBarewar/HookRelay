import type { ComponentProps } from "react";
import { Link } from "react-router";

import { cx } from "../../lib/cx.ts";
import { Spinner } from "./Spinner.tsx";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary: "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

function buttonClasses({ variant = "primary", size = "md" }: StyleProps, className?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> &
  StyleProps & {
    /** Shows a spinner and blocks clicks. Pair with a label that describes the work in progress. */
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={buttonClasses({ variant, size }, className)}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

/** A link that looks like a button, for navigation (use `Button` for actions). */
export function ButtonLink({
  variant,
  size,
  className,
  ...rest
}: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClasses({ variant, size }, className)} {...rest} />;
}
