import { useEffect, useRef, useState } from "react";

import { copyText } from "../../lib/copy-text.ts";
import { IconButton } from "./IconButton.tsx";

const iconProps = {
  className: "size-[18px]",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const FEEDBACK_MS = 2000;

interface CopyButtonProps {
  /** The text that ends up on the clipboard. */
  value: string;
  /** Names the action, e.g. "Copy ID of Billing service". */
  label: string;
}

/**
 * Icon button that copies `value`. The icon turns into a tick (or a cross if the browser refused)
 * for a moment, and a screen reader hears the result.
 */
export function CopyButton({ value, label }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    setState((await copyText(value)) ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), FEEDBACK_MS);
  }

  return (
    <>
      <IconButton
        label={label}
        onClick={() => void copy()}
        tone={state === "copied" ? "success" : state === "failed" ? "error" : "default"}
      >
        {state === "copied" ? (
          <svg {...iconProps}>
            <path d="m5 12 5 5 9-10" />
          </svg>
        ) : state === "failed" ? (
          <svg {...iconProps}>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg {...iconProps}>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </svg>
        )}
      </IconButton>
      <span role="status" className="sr-only">
        {state === "copied" && "Copied"}
        {state === "failed" && "Couldn’t copy"}
      </span>
    </>
  );
}
