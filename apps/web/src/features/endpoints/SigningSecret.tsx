import { useEffect, useRef, useState } from "react";

import { Button } from "../../components/ui/Button.tsx";

/**
 * Shows an endpoint's signing secret and makes it easy to copy. The API reveals it only once, so
 * this is the person's only chance to save it.
 */
export function SigningSecret({ secret }: { secret: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const secretRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);

  // This view replaces the form, so move focus to its main action.
  useEffect(() => copyRef.current?.focus(), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(secret);
      setCopyState("copied");
    } catch {
      // No clipboard access (for example an insecure page): select it so Ctrl/⌘+C works.
      const range = document.createRange();
      range.selectNodeContents(secretRef.current!);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      setCopyState("failed");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">Signing secret</p>
      <div className="flex items-stretch gap-2">
        <code
          ref={secretRef}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 font-mono text-[13px] leading-5 break-all text-slate-900 select-all"
        >
          {secret}
        </code>
        <Button
          ref={copyRef}
          type="button"
          variant="secondary"
          className="shrink-0"
          onClick={() => void copy()}
        >
          {copyState === "copied" ? "Copied" : "Copy"}
        </Button>
      </div>
      <p aria-live="polite" className="min-h-5 text-[13px] leading-5 text-slate-600">
        {copyState === "copied" && "Copied to your clipboard."}
        {copyState === "failed" &&
          "Couldn’t copy automatically. The secret is selected: press Ctrl+C or ⌘C."}
      </p>
    </div>
  );
}
