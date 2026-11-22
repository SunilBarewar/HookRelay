import { useState, type FormEvent } from "react";

import { Button } from "../../components/ui/Button.tsx";
import { TextField } from "../../components/ui/TextField.tsx";
import { CredentialsBody } from "@hookrelay/shared/schemas";
import type { CredentialField, FormError } from "./errors.ts";
import { PasswordField } from "./PasswordField.tsx";

type FieldErrors = Partial<Record<CredentialField, string>>;

interface CredentialsFormProps {
  submitLabel: string;
  /** Button label while the request is in flight, e.g. "Logging in…". */
  pendingLabel: string;
  passwordAutoComplete: "current-password" | "new-password";
  passwordHint?: string;
  pending: boolean;
  /** Should reject on failure; the rejection is turned into a message by `describeError`. */
  onSubmit: (values: CredentialsBody) => Promise<unknown>;
  describeError: (error: unknown) => FormError;
}

/** Checks the values against the API's own schema, but words the problems for people. */
function validate(values: CredentialsBody): FieldErrors | null {
  const result = CredentialsBody.safeParse(values);
  if (result.success) return null;

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    if (issue.path[0] === "email") {
      errors.email ??= values.email
        ? "Enter a valid email address, like you@company.com."
        : "Enter your email address.";
    } else if (issue.path[0] === "password") {
      errors.password ??= values.password
        ? "Password must be at least 8 characters."
        : "Enter your password.";
    }
  }
  return errors;
}

function focusField(form: HTMLFormElement, name: CredentialField) {
  (form.elements.namedItem(name) as HTMLElement | null)?.focus();
}

export function CredentialsForm({
  submitLabel,
  pendingLabel,
  passwordAutoComplete,
  passwordHint,
  pending,
  onSubmit,
  describeError,
}: CredentialsFormProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    };

    setFormError(undefined);

    const problems = validate(values);
    if (problems) {
      setFieldErrors(problems);
      focusField(form, problems.email ? "email" : "password");
      return;
    }

    setFieldErrors({});
    try {
      await onSubmit(values);
    } catch (error) {
      const { field, message } = describeError(error);
      if (field) {
        setFieldErrors({ [field]: message });
        focusField(form, field);
      } else {
        setFormError(message);
      }
    }
  }

  /** Drop a field's error as soon as the person starts correcting it. */
  function clearFieldError(event: FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as CredentialField;
    setFieldErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }

  return (
    <form onSubmit={handleSubmit} onChange={clearFieldError} noValidate className="space-y-5">
      <TextField
        label="Email address"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={fieldErrors.email}
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete={passwordAutoComplete}
        hint={passwordHint}
        error={fieldErrors.password}
      />

      <div aria-live="polite">
        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-800"
          >
            {formError}
          </p>
        )}
      </div>

      <Button type="submit" loading={pending} className="w-full">
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
