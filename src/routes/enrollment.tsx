import { createFileRoute } from "@tanstack/react-router";
import { Check, ClipboardCopy, Loader2, Mail, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Column, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { COURSE_CONFIG, courseName } from "@/config/courses";
import { MOCK_BATCHES, MOCK_STUDENTS } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { sendEnrollmentEmail } from "@/services/gmail.service";
import type { EnrollmentBatch, Student } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/enrollment")({
  head: () => ({
    meta: [
      { title: "Enrollment Manager — Enrollment Ops" },
      {
        name: "description",
        content:
          "Guided enrollment workflow: pick a course, copy remaining emails, create a batch, confirm the portal step and send enrollment emails.",
      },
      { property: "og:title", content: "Enrollment Manager — Enrollment Ops" },
      {
        property: "og:description",
        content: "Step-by-step enrollment batches for the external course portal.",
      },
    ],
  }),
  component: EnrollmentPage,
});

const STEPS = [
  "Select course",
  "Review eligible students",
  "Copy remaining emails",
  "Create batch",
  "Batch summary",
  "Paste into course portal",
  "Confirm enrollment",
  "Send enrollment email",
  "Status updated",
];

function EnrollmentPage() {
  const [courseId, setCourseId] = useState<string>(COURSE_CONFIG[0]!.id);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(0);
  const [batches, setBatches] = useState<EnrollmentBatch[]>(MOCK_BATCHES);
  const [sending, setSending] = useState(false);
  const [activeBatch, setActiveBatch] = useState<EnrollmentBatch | null>(null);

  const eligible = useMemo(
    () =>
      MOCK_STUDENTS.filter(
        (s) =>
          s.courseId === courseId &&
          (s.enrollmentStatus === "Pending Enrollment" || s.enrollmentStatus === "Emails Copied"),
      ),
    [courseId],
  );

  async function handleCopy() {
    const emails = eligible.map((s) => s.collegeEmailId).join(", ");
    try {
      await navigator.clipboard.writeText(emails);
    } catch {
      toast.error("Copying was blocked by the browser. Select the emails manually instead.");
      return;
    }
    setCopied(eligible.length);
    setStep(4);
    toast.success(`${eligible.length} email addresses copied to the clipboard.`);
  }

  function handleCreateBatch() {
    const duplicate = batches.find(
      (b) => b.courseId === courseId && b.status === "Awaiting Portal Confirmation",
    );
    if (duplicate) {
      toast.error(
        `An open batch (${duplicate.id}) already exists for this course. Close it before creating another.`,
      );
      return;
    }
    const batch: EnrollmentBatch = {
      id: `BATCH-2026-${String(43 + batches.length).padStart(4, "0")}`,
      courseId,
      studentCount: eligible.length,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      status: "Awaiting Portal Confirmation",
    };
    setBatches((b) => [batch, ...b]);
    setActiveBatch(batch);
    setStep(5);
    toast.success(`${batch.id} created with ${batch.studentCount} students.`);
  }

  async function handleSendEmails() {
    setSending(true);
    try {
      const result = await sendEnrollmentEmail(eligible.map((s) => s.id));
      setBatches((b) =>
        b.map((x) =>
          x.id === activeBatch?.id ? { ...x, status: "Enrollment Email Sent" as const } : x,
        ),
      );
      setStep(9);
      toast.success(`${result.sent} enrollment emails queued through Gmail.`);
    } catch {
      toast.error("Gmail could not send these emails. You can retry them from Failed Emails.");
    } finally {
      setSending(false);
    }
  }

  const studentColumns: Column<Student>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (s) => s.fullName,
      cell: (s) => <span className="font-medium">{s.fullName}</span>,
    },
    { key: "email", header: "Email", cell: (s) => s.collegeEmailId },
    { key: "branch", header: "Branch", cell: (s) => s.branch },
    { key: "year", header: "Year", cell: (s) => s.yearOfStudy },
    { key: "status", header: "Status", cell: (s) => <StatusBadge status={s.enrollmentStatus} /> },
  ];

  const batchColumns: Column<EnrollmentBatch>[] = [
    {
      key: "id",
      header: "Batch ID",
      cell: (b) => <span className="font-mono text-xs font-medium">{b.id}</span>,
    },
    { key: "course", header: "Course", cell: (b) => courseName(b.courseId) },
    { key: "count", header: "Students", cell: (b) => b.studentCount },
    { key: "by", header: "Created by", cell: (b) => b.createdBy },
    { key: "at", header: "Created at", cell: (b) => formatDateTime(b.createdAt) },
    { key: "status", header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Enrollment Manager"
        description="Emails are copied for the external course portal, then enrollment is confirmed and communicated from here."
      />

      <ol className="surface-card flex flex-wrap gap-1.5 p-3" aria-label="Workflow steps">
        {STEPS.map((label, i) => {
          const index = i + 1;
          const done = index < step;
          const current = index === step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
                current
                  ? "border-primary bg-accent text-accent-foreground"
                  : done
                    ? "border-success-foreground/20 bg-success text-success-foreground"
                    : "border-border bg-muted/40 text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3" aria-hidden /> : <span>{index}</span>}
              {label}
            </li>
          );
        })}
      </ol>

      <section className="surface-card space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,18rem)_auto] sm:items-end">
          <div>
            <Label htmlFor="course-select" className="text-xs text-muted-foreground">
              Course
            </Label>
            <Select
              value={courseId}
              onValueChange={(v) => {
                setCourseId(v);
                setStep(2);
                setCopied(0);
                setActiveBatch(null);
              }}
            >
              <SelectTrigger id="course-select" className="mt-1 h-9 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURSE_CONFIG.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={eligible.length === 0}>
              <ClipboardCopy className="size-4" aria-hidden />
              Copy remaining emails
            </Button>
            <Button onClick={handleCreateBatch} disabled={copied === 0}>
              <Plus className="size-4" aria-hidden />
              Create enrollment batch
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Students selected</p>
            <p className="text-lg font-semibold tabular-nums">{eligible.length}</p>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Emails copied</p>
            <p className="text-lg font-semibold tabular-nums">{copied}</p>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Active batch</p>
            <p className="truncate font-mono text-sm font-semibold">{activeBatch?.id ?? "—"}</p>
          </div>
        </div>

        {activeBatch && (
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/25 bg-accent/40 p-3">
            <p className="min-w-0 flex-1 text-sm">
              Paste the copied emails into the external course portal, then confirm the enrollment
              here.
            </p>
            <Button variant="outline" size="sm" onClick={() => setStep(7)}>
              Confirm portal enrollment
            </Button>
            <ConfirmationDialog
              trigger={
                <Button size="sm" disabled={step < 7 || sending}>
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Mail className="size-4" aria-hidden />
                  )}
                  Send enrollment emails
                </Button>
              }
              title="Send enrollment emails?"
              description={`${eligible.length} students in ${courseName(courseId)} will receive the enrollment email. This cannot be undone.`}
              confirmLabel="Send emails"
              onConfirm={handleSendEmails}
            />
          </div>
        )}
      </section>

      <section aria-labelledby="eligible-heading" className="space-y-3">
        <h2 id="eligible-heading" className="text-sm font-semibold">
          Eligible students — {courseName(courseId)}
        </h2>
        <DataTable
          rows={eligible}
          columns={studentColumns}
          getRowId={(s) => s.id}
          pageSize={8}
          emptyTitle="No students are waiting for enrollment in this course"
        />
      </section>

      <section aria-labelledby="batches-heading" className="space-y-3">
        <h2 id="batches-heading" className="text-sm font-semibold">
          Enrollment batches
        </h2>
        <DataTable rows={batches} columns={batchColumns} getRowId={(b) => b.id} pageSize={8} />
      </section>
    </div>
  );
}
