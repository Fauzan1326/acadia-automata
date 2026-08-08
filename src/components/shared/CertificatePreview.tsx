import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { courseName } from "@/config/courses";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import type { Certificate } from "@/lib/types";

export function CertificatePreview({
  certificate,
  open,
  onOpenChange,
  onSend,
}: {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSend: (certificate: Certificate) => void;
}) {
  if (!certificate) return null;
  const student = MOCK_STUDENTS.find((s) => s.id === certificate.studentId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Certificate preview</DialogTitle>
          <DialogDescription>
            Review the certificate before it is emailed. Nothing is sent until you confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Student name</dt>
              <dd className="font-medium">{student?.fullName ?? certificate.extractedName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all font-medium">{student?.collegeEmailId ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Course</dt>
              <dd className="font-medium">{courseName(certificate.courseId)}</dd>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <StatusBadge status={certificate.signed ? "Certificate Signed" : "Pending"} />
              <StatusBadge status={certificate.sent ? "Sent" : "Pending"} />
            </div>
          </dl>

          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong bg-muted/30 p-6 text-center">
            <FileText className="size-6 text-muted-foreground" aria-hidden />
            <p className="text-xs font-medium">{certificate.fileName}</p>
            <p className="text-xs text-muted-foreground">
              Rendered preview comes from the existing certificate signer
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSend(certificate)} disabled={!certificate.signed}>
            Send certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
