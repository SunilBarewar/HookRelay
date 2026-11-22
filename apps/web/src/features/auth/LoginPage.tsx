import { Link } from "react-router";

import { ApiError } from "../../lib/api/index.ts";
import { AuthLayout } from "./AuthLayout.tsx";
import { CredentialsForm } from "./CredentialsForm.tsx";
import { describeApiError, type FormError } from "./errors.ts";
import { useLogin } from "./hooks.ts";

function describeLoginError(error: unknown): FormError {
  if (error instanceof ApiError && error.status === 401) {
    return { message: "That email and password don’t match. Check them and try again." };
  }
  return describeApiError(error);
}

export function LoginPage() {
  const login = useLogin();

  return (
    <AuthLayout
      pageTitle="Log in"
      title="Welcome back"
      description="Log in to manage your applications and see how your webhooks are being delivered."
      footer={
        <>
          New to HookRelay?{" "}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </>
      }
    >
      <CredentialsForm
        submitLabel="Log in"
        pendingLabel="Logging in…"
        passwordAutoComplete="current-password"
        pending={login.isPending}
        onSubmit={login.mutateAsync}
        describeError={describeLoginError}
      />
    </AuthLayout>
  );
}
