import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import type { ActivityLog } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

const ICONS = {
  Success: CheckCircle2,
  Failed: XCircle,
  Warning: CircleDashed,
} as const;

const TONES = {
  Success: "text-success-foreground",
  Failed: "text-destructive",
  Warning: "text-warning-foreground",
} as const;

export function ActivityTimeline({ items }: { items: ActivityLog[] }) {
  return (
    <ol className="relative space-y-4 pl-5">
      <span
        className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
        aria-hidden
      />
      {items.map((item) => {
        const Icon = ICONS[item.result];
        return (
          <li key={item.id} className="relative">
            <Icon
              className={`absolute -left-5 top-0.5 size-3.5 bg-card ${TONES[item.result]}`}
              aria-hidden
            />
            <p className="text-sm font-medium leading-snug">{item.action}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDateTime(item.time)} · {item.module}
              {item.student ? ` · ${item.student}` : ""} · {item.result}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
