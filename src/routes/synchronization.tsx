import { createFileRoute } from "@tanstack/react-router";
import { Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Column, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { MOCK_SYNC_HISTORY } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { runSynchronization } from "@/services/sheets.service";
import type { SyncResult } from "@/lib/types";

export const Route = createFileRoute("/synchronization")({
  head: () => ({
    meta: [
      { title: "Registration Synchronization — Enrollment Ops" },
      {
        name: "description",
        content:
          "Pull new Google Form responses into the existing course tabs with duplicate checks and a full sync history.",
      },
      { property: "og:title", content: "Registration Synchronization — Enrollment Ops" },
      {
        property: "og:description",
        content: "Read-only form responses in, existing course tabs updated safely.",
      },
    ],
  }),
  component: SyncPage,
});

const WORKFLOW = [
  "Google Form Response Sheet",
  "Read new responses",
  "Duplicate check",
  "Course identification",
  "Append to correct course tab",
  "Dashboard updated",
];

function SyncPage() {
  const [history, setHistory] = useState<SyncResult[]>(MOCK_SYNC_HISTORY);
  const [running, setRunning] = useState(false);
  const last = history[0]!;

  async function handleSync() {
    setRunning(true);
    try {
      const result = await runSynchronization();
      setHistory((h) => [result, ...h]);
      toast.success(
        `Synchronization complete — ${result.newRecords} new, ${result.duplicates} duplicates.`,
      );
    } catch {
      toast.error("Google Sheets could not be reached. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  const columns: Column<SyncResult>[] = [
    { key: "time", header: "Timestamp", cell: (r) => formatDateTime(r.timestamp) },
    { key: "admin", header: "Admin", cell: (r) => r.admin },
    { key: "new", header: "New records", cell: (r) => r.newRecords },
    { key: "dupes", header: "Duplicates", cell: (r) => r.duplicates },
    { key: "fails", header: "Failures", cell: (r) => r.failures },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Registration Synchronization"
        description="New form responses are read only. Records are appended to the existing course tabs — the response sheet is never modified."
        actions={
          <ConfirmationDialog
            trigger={
              <Button disabled={running}>
                {running ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <RefreshCcw className="size-4" aria-hidden />
                )}
                Sync new registrations
              </Button>
            }
            title="Sync new registrations?"
            description="New responses will be appended to the mapped course tabs. Existing rows, headers and the form response sheet remain unchanged."
            confirmLabel="Run synchronization"
            onConfirm={handleSync}
          />
        }
      />

      <div className="surface-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Last sync
        </p>
        <p className="mt-1 text-sm font-medium">{formatDateTime(last.timestamp)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="New" value={last.newRecords} />
          <StatCard label="Duplicates" value={last.duplicates} />
          <StatCard label="Failed" value={last.failures} emphasis={last.failures > 0} />
          <StatCard label="Review required" value={last.reviewRequired} />
        </div>
      </div>

      <section aria-labelledby="workflow-heading" className="surface-card p-4">
        <h2 id="workflow-heading" className="text-sm font-semibold">
          How synchronization works
        </h2>
        <ol className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {WORKFLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 font-medium">
                {i + 1}. {step}
              </span>
              {i < WORKFLOW.length - 1 && (
                <span className="text-muted-foreground" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="history-heading" className="space-y-3">
        <h2 id="history-heading" className="text-sm font-semibold">
          Synchronization history
        </h2>
        <DataTable rows={history} columns={columns} getRowId={(r) => r.id} pageSize={10} />
      </section>
    </div>
  );
}
