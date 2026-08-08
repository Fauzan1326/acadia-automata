import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, Shuffle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Column, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { CertificatePreview } from "@/components/shared/CertificatePreview";
import { Button } from "@/components/ui/button";
import { courseName } from "@/config/courses";
import { MOCK_CERTIFICATES, MOCK_STUDENTS } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { signCertificate } from "@/services/certificate.service";
import { sendCertificateEmail } from "@/services/gmail.service";
import type { Certificate } from "@/lib/types";

export const Route = createFileRoute("/review-queue")({
  head: () => ({
    meta: [
      { title: "Review Queue — Enrollment Ops" },
      {
        name: "description",
        content:
          "Certificates that could not be matched with confidence. Confirm, reassign, reject or retry before anything is sent.",
      },
      { property: "og:title", content: "Review Queue — Enrollment Ops" },
      {
        property: "og:description",
        content: "Human review for ambiguous, unmatched or invalid certificates.",
      },
    ],
  }),
  component: ReviewQueuePage,
});

function ReviewQueuePage() {
  const [queue, setQueue] = useState<Certificate[]>(
    MOCK_CERTIFICATES.filter((c) => c.matchState !== "MATCHED"),
  );
  const [preview, setPreview] = useState<Certificate | null>(null);

  async function confirmMatch(cert: Certificate) {
    const candidate =
      MOCK_STUDENTS.find((s) => s.fullName === cert.extractedName) ?? MOCK_STUDENTS[0]!;
    try {
      await signCertificate(cert.id);
      const updated: Certificate = {
        ...cert,
        matchState: "MATCHED",
        studentId: candidate.id,
        courseId: candidate.courseId,
        signed: true,
      };
      setQueue((q) => q.map((c) => (c.id === cert.id ? updated : c)));
      setPreview(updated);
      toast.success("Match confirmed and certificate signed. Review the preview before sending.");
    } catch {
      toast.error("The certificate signer could not be reached. Please try again.");
    }
  }

  async function send(cert: Certificate) {
    try {
      await sendCertificateEmail(cert.id);
      setQueue((q) => q.filter((c) => c.id !== cert.id));
      setPreview(null);
      toast.success("Certificate sent and completion recorded.");
    } catch {
      toast.error("Gmail could not send this certificate. You can retry it from Failed Emails.");
    }
  }

  const columns: Column<Certificate>[] = [
    {
      key: "file",
      header: "Certificate",
      cell: (c) => <span className="font-medium">{c.fileName}</span>,
    },
    { key: "name", header: "Extracted name", cell: (c) => c.extractedName },
    { key: "course", header: "Course", cell: (c) => courseName(c.courseId) },
    {
      key: "possible",
      header: "Possible student",
      cell: (c) =>
        MOCK_STUDENTS.find((s) => s.fullName === c.extractedName)?.collegeEmailId ?? "—",
    },
    {
      key: "reason",
      header: "Reason",
      cell: (c) => <span className="text-muted-foreground">{c.reason ?? "—"}</span>,
    },
    {
      key: "uploaded",
      header: "Uploaded",
      sortValue: (c) => c.uploadedAt,
      cell: (c) => formatDateTime(c.uploadedAt),
    },
    { key: "state", header: "Status", cell: (c) => <StatusBadge status={c.matchState} /> },
    {
      key: "actions",
      header: "Action",
      cell: (c) => (
        <div className="flex flex-wrap gap-1.5">
          {c.matchState === "MATCHED" ? (
            <Button size="sm" className="h-8" onClick={() => setPreview(c)}>
              Preview & send
            </Button>
          ) : (
            <>
              <ConfirmationDialog
                trigger={
                  <Button variant="outline" size="sm" className="h-8">
                    <Check className="size-3.5" aria-hidden />
                    Confirm
                  </Button>
                }
                title="Confirm this match?"
                description={`"${c.extractedName}" will be signed and prepared for delivery. Nothing is emailed until you approve the preview.`}
                confirmLabel="Confirm match"
                onConfirm={() => confirmMatch(c)}
              />
              <Button variant="outline" size="sm" className="h-8">
                <Shuffle className="size-3.5" aria-hidden />
                Reassign
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => toast.success("Certificate re-queued for matching.")}
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Retry
              </Button>
              <ConfirmationDialog
                destructive
                trigger={
                  <Button variant="ghost" size="sm" className="h-8 text-destructive">
                    <X className="size-3.5" aria-hidden />
                    Reject
                  </Button>
                }
                title="Reject this certificate?"
                description="The certificate will be removed from the queue. This cannot be undone."
                confirmLabel="Reject"
                onConfirm={() => {
                  setQueue((q) => q.filter((x) => x.id !== c.id));
                  toast.success("Certificate rejected.");
                }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Certificates Requiring Review"
        description="Uncertain certificates are never sent automatically. Confirm the student here first."
      />
      <DataTable
        rows={queue}
        columns={columns}
        getRowId={(c) => c.id}
        pageSize={10}
        emptyTitle="The review queue is empty"
        emptyDescription="Every processed certificate was matched with confidence."
      />
      <CertificatePreview
        certificate={preview}
        open={preview !== null}
        onOpenChange={(v) => !v && setPreview(null)}
        onSend={send}
      />
    </div>
  );
}
