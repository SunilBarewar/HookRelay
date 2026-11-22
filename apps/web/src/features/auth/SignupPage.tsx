import { Link } from "react-router";

import { ApiError } from "../../lib/api/index.ts";
import { AuthLayout } from "./AuthLayout.tsx";
import { CredentialsForm } from "./CredentialsForm.tsx";
import { describeApiError, type FormError } from "./errors.ts";
import { useSignup } from "./hooks.ts";

function describeSignupError(error: unknown): FormError {
  if (error instanceof ApiError && error.status === 409) {
    return {
      field: "email",
      message: "An account with this email already exists. Try logging in.",
    };
  }
  return describeApiError(error);
}

export function SignupPage() {
  const signup = useSignup();

  return (
    <AuthLayout
      pageTitle="Create your account"
      title="Create your account"
      description="Create an account to start sending webhooks and tracking every delivery."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </>
      }
    >
      <CredentialsForm
        submitLabel="Create account"
        pendingLabel="Creating account…"
        passwordAutoComplete="new-password"
        passwordHint="Use at least 8 characters."
        pending={signup.isPending}
        onSubmit={signup.mutateAsync}
        describeError={describeSignupError}
      />
    </AuthLayout>
  );
}
