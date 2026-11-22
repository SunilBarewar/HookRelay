import { Button } from "./Button.tsx";

interface ErrorAlertProps {
  title: string;
  message: string;
  onRetry: () => void;
  /** True while the retry is running. */
  retrying: boolean;
}

/** A load failure with a way to try again. */
export function ErrorAlert({ title, message, onRetry, retrying }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-semibold text-red-900">{title}</p>
        <p className="mt-1 text-sm text-red-800">{message}</p>
      </div>
      <Button variant="secondary" loading={retrying} onClick={onRetry}>
        {retrying ? "Retrying…" : "Try again"}
      </Button>
    </div>
  );
}
