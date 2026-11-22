import { Link } from "react-router";

import { CopyButton } from "../../components/ui/CopyButton.tsx";
import { IconButton } from "../../components/ui/IconButton.tsx";
import { cx } from "../../lib/cx.ts";
import { applicationPath } from "../../routes/paths.ts";
import type { ApplicationResponse } from "../../lib/api/index.ts";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const iconProps = {
  className: "size-[18px]",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

interface ApplicationRowProps {
  application: ApplicationResponse;
  /** Briefly tint the row, to point out an application that was just created or renamed. */
  highlighted?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ApplicationRow({
  application,
  highlighted = false,
  onEdit,
  onDelete,
}: ApplicationRowProps) {
  return (
    <li
      className={cx("flex items-center gap-3 py-3 pr-3 pl-5", highlighted && "animate-highlight")}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">
          <Link
            to={applicationPath(application.id)}
            className="rounded text-slate-900 hover:text-brand-700 hover:underline"
          >
            {application.name}
          </Link>
        </p>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Created{" "}
          <time dateTime={application.createdAt}>
            {dateFormat.format(new Date(application.createdAt))}
          </time>
          {" · "}
          <Link
            to={applicationPath(application.id)}
            className="rounded font-medium text-brand-700 hover:underline"
          >
            View endpoints<span className="sr-only"> for {application.name}</span>
          </Link>
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        <CopyButton value={application.id} label={`Copy application ID`} />
        <IconButton label={`Rename ${application.name}`} onClick={onEdit}>
          <svg {...iconProps}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
          </svg>
        </IconButton>
        <IconButton label={`Delete ${application.name}`} tone="danger" onClick={onDelete}>
          <svg {...iconProps}>
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </IconButton>
      </div>
    </li>
  );
}
