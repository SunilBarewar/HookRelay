import { useId, type ComponentProps, type ReactNode } from "react";

import { cx } from "../../lib/cx.ts";
import { FieldMessage } from "./FieldMessage.tsx";
import { fieldClasses } from "./field-classes.ts";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  /** Format or purpose hint, shown until there is an error to show instead. */
  hint?: string;
  error?: string;
  /** Control rendered inside the right edge of the input, e.g. a show/hide button. */
  trailing?: ReactNode;
};

export function TextField({ label, hint, error, trailing, className, ...input }: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error ?? hint);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cx("h-11", fieldClasses(Boolean(error)), Boolean(trailing) && "pr-11")}
          {...input}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center">{trailing}</div>}
      </div>
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
