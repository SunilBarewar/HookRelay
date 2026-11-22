import { useEffect, useRef, type RefObject } from "react";

/**
 * Keeps focus from being lost when a dialog closes and the control that opened it is gone, for
 * example after deleting the row whose button opened the dialog. The browser then has nowhere to
 * return focus, so it falls to <body>.
 *
 * Call the returned function when a dialog closes. Once `trigger` changes and focus really has
 * fallen to <body>, the first target that exists receives it. Pass the page heading last.
 */
export function useFocusFallback(trigger: unknown, targets: RefObject<HTMLElement | null>[]) {
  const pending = useRef(false);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    if (document.activeElement === document.body) {
      targets.find((target) => target.current)?.current?.focus();
    }
    // `targets` is a list of stable refs, so it never needs to re-run the effect.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [trigger]);

  return () => {
    pending.current = true;
  };
}
