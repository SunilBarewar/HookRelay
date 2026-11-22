import { useState, type ComponentProps } from "react";

import { TextField } from "../../components/ui/TextField.tsx";

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, "type" | "trailing">;

const iconProps = {
  className: "size-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Password input with a show/hide toggle, so people can check what they typed. */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="m-0.5 flex size-10 items-center justify-center rounded-md text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          {visible ? (
            <svg {...iconProps}>
              <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.7 9.7 0 0 1 12 5c5 0 8.5 4.5 9.5 7a11.7 11.7 0 0 1-2.6 3.8M6.6 6.6C4.4 8 2.9 10.3 2.5 12c1 2.5 4.5 7 9.5 7 1.5 0 2.9-.4 4-1" />
            </svg>
          ) : (
            <svg {...iconProps}>
              <path d="M2.5 12C3.5 9.5 7 5 12 5s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7s-8.5-4.5-9.5-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      }
    />
  );
}
