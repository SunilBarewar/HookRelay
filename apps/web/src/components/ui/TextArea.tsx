import { useId, type ComponentProps } from "react";

import { cx } from "../../lib/cx.ts";
import { FieldMessage } from "./FieldMessage.tsx";
import { fieldClasses } from "./field-classes.ts";

type TextAreaProps = Omit<ComponentProps<"textarea">, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextArea({ label, hint, error, className, ...textarea }: TextAreaProps) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={cx("min-h-24 py-2.5 leading-6", fieldClasses(Boolean(error)))}
        {...textarea}
      />
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
