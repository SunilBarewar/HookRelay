import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  /** Called after the dialog closes by any route: Escape, backdrop, close button or `open` going false. Must be safe to call twice. */
  onClose: () => void;
  title: string;
  description?: string;
  /** Set false while work is in progress to block Escape, backdrop and close-button dismissal. */
  dismissible?: boolean;
  children: ReactNode;
}

/**
 * Modal dialog on the native <dialog> element, so focus is trapped, Escape closes it and focus
 * returns to the opener. Children mount only while open, so forms start fresh each time.
 * Put `data-autofocus` on the element that should receive focus first.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  dismissible = true,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape fires `cancel` first; stopping it keeps the dialog open.
      onCancel={(event) => {
        if (!dismissible) event.preventDefault();
      }}
      onClose={onClose}
      // A click on the dialog element itself, not its content, is a click on the backdrop.
      onClick={(event) => {
        if (dismissible && event.target === event.currentTarget) ref.current?.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 max-sm:mt-auto max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
    >
      {open && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1.5 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close"
              disabled={!dismissible}
              onClick={() => ref.current?.close()}
              className="-m-2 flex size-10 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-brand-600 disabled:opacity-40"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}
