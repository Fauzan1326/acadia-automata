import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const STATUS_TONE: Record<string, Tone> = {
  "Pending Registration": "neutral",
  "Pending Enrollment": "warning",
  "Emails Copied": "info",
  "Enrollment Email Sent": "info",
  "Waiting for Completion": "info",
  "Not Started": "neutral",
  "Certificate Uploaded": "info",
  "Certificate Pending Review": "warning",
  "Certificate Signed": "info",
  "Certificate Sent": "success",
  Completed: "success",
  Sent: "success",
  Failed: "danger",
  Pending: "warning",
  Retrying: "warning",
  Success: "success",
  Warning: "warning",
  Partial: "warning",
  MATCHED: "success",
  AMBIGUOUS: "warning",
  "NO MATCH": "danger",
  "INVALID FILE": "danger",
  "DUPLICATE CERTIFICATE": "warning",
  CONNECTED: "success",
  DISCONNECTED: "danger",
  "NOT CONFIGURED": "neutral",
  Yes: "success",
  No: "neutral",
  "Awaiting Portal Confirmation": "warning",
  Closed: "neutral",
};

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-neutral-badge text-neutral-badge-foreground border-border-strong",
  info: "bg-info text-info-foreground border-info-foreground/20",
  success: "bg-success text-success-foreground border-success-foreground/20",
  warning: "bg-warning text-warning-foreground border-warning-foreground/20",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
};

const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-neutral-badge-foreground",
  info: "bg-info-foreground",
  success: "bg-success-foreground",
  warning: "bg-warning-foreground",
  danger: "bg-destructive",
};

export function StatusBadge({
  status,
  className,
  showDot = true,
}: {
  status: string;
  className?: string;
  showDot?: boolean;
}) {
  const tone = STATUS_TONE[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        TONE_CLASS[tone],
        className,
      )}
    >
      {showDot && <span className={cn("size-1.5 rounded-full", TONE_DOT[tone])} aria-hidden />}
      {status}
    </span>
  );
}
