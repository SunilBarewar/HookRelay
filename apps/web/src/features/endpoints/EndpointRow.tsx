import { IconButton } from "../../components/ui/IconButton.tsx";
import { cx } from "../../lib/cx.ts";
import type { EndpointResponse } from "../../lib/api/index.ts";
import { StatusBadge } from "./StatusBadge.tsx";

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

interface EndpointRowProps {
  endpoint: EndpointResponse;
  /** Briefly tint the row, to point out an endpoint that was just changed. */
  highlighted?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function EndpointRow({ endpoint, highlighted = false, onEdit, onDelete }: EndpointRowProps) {
  return (
    <li className={cx("flex items-start gap-3 py-4 pr-3 pl-5", highlighted && "animate-highlight")}>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="min-w-0 text-[15px] font-semibold break-all text-slate-900">
            {endpoint.url}
          </p>
          <StatusBadge status={endpoint.status} />
        </div>

        {endpoint.description && (
          <p className="text-sm leading-6 text-slate-600">{endpoint.description}</p>
        )}

        <ul aria-label="Event types" className="flex flex-wrap gap-1.5">
          {[...endpoint.eventTypes].sort().map((eventType) => (
            <li
              key={eventType}
              className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700"
            >
              {eventType}
            </li>
          ))}
        </ul>

        <p className="text-[13px] text-slate-500">
          Created{" "}
          <time dateTime={endpoint.createdAt}>
            {dateFormat.format(new Date(endpoint.createdAt))}
          </time>
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        <IconButton label={`Edit endpoint ${endpoint.url}`} onClick={onEdit}>
          <svg {...iconProps}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
          </svg>
        </IconButton>
        <IconButton label={`Delete endpoint ${endpoint.url}`} tone="danger" onClick={onDelete}>
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
