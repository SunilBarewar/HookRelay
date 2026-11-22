import { cx } from "../../lib/cx.ts";
import type { ApplicationResponse } from "../../lib/api/index.ts";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

interface ApplicationRowProps {
  application: ApplicationResponse;
  /** Briefly tint the row, to point out an application that was just created. */
  highlighted?: boolean;
}

export function ApplicationRow({ application, highlighted = false }: ApplicationRowProps) {
  return (
    <li
      className={cx(
        "flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        highlighted && "animate-highlight",
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-slate-900">{application.name}</p>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Created{" "}
          <time dateTime={application.createdAt}>
            {dateFormat.format(new Date(application.createdAt))}
          </time>
        </p>
      </div>
      <p className="font-mono text-xs break-all text-slate-500 sm:text-right">
        <span className="sr-only">Application ID: </span>
        {application.id}
      </p>
    </li>
  );
}
