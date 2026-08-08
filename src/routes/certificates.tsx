import { createFileRoute } from "@tanstack/react-router";
import { FileSignature, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Column, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FileUpload } from "@/components/shared/FileUpload";
import { CertificatePreview } from "@/components/shared/CertificatePreview";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courseName } from "@/config/courses";
import { MOCK_CERTIFICATES } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { processZip, signCertificate, type ProcessingSummary } from "@/services/certificate.service";
import { sendCertificateEmail } from "@/services/gmail.service";
import type { Certificate } from "@/lib/types";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificate Manager — Enrollment Ops" },
      {
        name: "description",
        content:
          "Upload a certificates ZIP, match students, sign through the existing signer, preview and deliver by email.",
      },
      { property: "og:title", content: "Certificate Manager — Enrollment Ops" },
      {
        property: "og:description",
        content: "ZIP validation, matching, signing and certificate delivery in one place.",
      },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const [progress, setProgress] = useState<number | null>(null);
  const [summary, setSummary] = useState<ProcessingSummary | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>(MOCK_CERTIFICATES);
  const [preview, setPreview] = useState<Certificate | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setProgress(0);
    const timer = setInterval(
      () => setProgress((p) => (p === null ? 0 : Math.min(95, p + 7))),
      120,
    );
    try {
      const result = await processZip(file);
      setSummary(result);
      setProgress(100);
      toast.success(
        `${result.totalFiles} certificates processed — ${result.reviewRequired} need review.`,
      );
    } catch {
      toast.error("The uploaded ZIP is invalid. Please check the file and try again.");
      setProgress(null);
    } finally {
      clearInterval(timer);
      setBusy(false);
    }
  }

  async function handleSign(cert: Certificate) {
    try {
      await signCertificate(cert.id);
      setCertificates((list) =>
        list.map((c) => (c.id === cert.id ? { ...c, signed: true } : c)),
      );
      toast.success("Certificate signed by the existing certificate signer.");
    } catch {
      toast.error("The certificate signer could not be reached. Please try again.");
    }
  }

  async function handleSend(cert: Certificate) {
    try {
      await sendCertificateEmail(cert.id);
      setCertificates((list) => list.map((c) => (c.id === cert.id ? { ...c, sent: true } : c)));
      setPreview(null);
      toast.success("Certificate emailed and completion recorded.");
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
    { key: "state", header: "Match", cell: (c) => <StatusBadge status={c.matchState} /> },
    {
      key: "uploaded",
      header: "Uploaded",
      sortValue: (c) => c.uploadedAt,
      cell: (c) => formatDateTime(c.uploadedAt),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => (
        <StatusBadge
          status={
            c.sent
              ? "Certificate Sent"
              : c.signed
                ? "Certificate Signed"
                : c.matchState === "MATCHED"
                  ? "Certificate Uploaded"
                  : "Certificate Pending Review"
          }
        />
      ),
    },
    {
      key: "actions",
      header: "Action",
      cell: (c) => (
        <div className="flex gap-1.5">
          {c.matchState === "MATCHED" && !c.signed && (
            <Button variant="outline" size="sm" className="h-8" onClick={() => handleSign(c)}>
              <FileSignature className="size-3.5" aria-hidden />
              Sign
            </Button>
          )}
          {c.signed && !c.sent && (
            <Button size="sm" className="h-8" onClick={() => setPreview(c)}>
              <Send className="size-3.5" aria-hidden />
              Preview & send
            </Button>
          )}
          {c.sent && <span className="text-xs text-muted-foreground">Delivered</span>}
          {c.matchState !== "MATCHED" && (
            <span className="text-xs text-muted-foreground">In review queue</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Certificates"
        description="Certificates are matched to students, signed by the existing signer, previewed, and only then delivered."
      />

      <section aria-labelledby="upload-heading" className="surface-card space-y-4 p-4">
        <h2 id="upload-heading" className="text-sm font-semibold">
          Upload certificates ZIP
        </h2>
        <FileUpload
          onFileAccepted={handleFile}
          busy={busy}
          {...(progress !== null ? { progress } : {})}
        />
        {progress !== null && (
          <div>
            <Progress value={progress} aria-label="Processing progress" />
            <p className="mt-1 text-xs text-muted-foreground">
              {progress < 100 ? "Processing certificates…" : "Processing complete"}
            </p>
          </div>
        )}
        {summary && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            <StatCard label="Files" value={summary.totalFiles} />
            <StatCard label="Matched" value={summary.matched} />
            <StatCard
              label="Review required"
              value={summary.reviewRequired}
              emphasis={summary.reviewRequired > 0}
            />
            <StatCard label="Failed" value={summary.failed} emphasis={summary.failed > 0} />
            <StatCard label="Signed" value={summary.signed} />
            <StatCard label="Sent" value={summary.sent} />
          </div>
        )}
      </section>

      <section aria-labelledby="cert-list-heading" className="space-y-3">
        <h2 id="cert-list-heading" className="text-sm font-semibold">
          Processed certificates
        </h2>
        <DataTable rows={certificates} columns={columns} getRowId={(c) => c.id} pageSize={10} />
      </section>

      <CertificatePreview
        certificate={preview}
        open={preview !== null}
        onOpenChange={(v) => !v && setPreview(null)}
        onSend={handleSend}
      />
    </div>
  );
}
