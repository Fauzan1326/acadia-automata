import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ActivityTimeline } from "@/components/shared/ActivityTimeline";
import { courseName, getCourse } from "@/config/courses";
import { MOCK_ACTIVITY, MOCK_EMAILS } from "@/lib/mock-data";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Student } from "@/lib/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-3 py-1.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words font-medium">{value}</dd>
    </div>
  );
}

export function StudentDetails({
  student,
  open,
  onOpenChange,
}: {
  student: Student | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!student) return null;
  const emails = MOCK_EMAILS.filter((e) => e.studentId === student.id);
  const activity = MOCK_ACTIVITY.filter((a) => a.student === student.fullName);
  const course = getCourse(student.courseId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-base">{student.fullName}</SheetTitle>
          <p className="text-sm text-muted-foreground">{student.collegeEmailId}</p>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-8">
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Student information
            </h3>
            <dl className="divide-y divide-border">
              <Row label="Branch" value={student.branch} />
              <Row label="Year of study" value={student.yearOfStudy} />
              <Row label="CPRN No." value={<span className="font-mono">{student.cprnNo}</span>} />
            </dl>
          </section>

          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Registration & enrollment
            </h3>
            <dl className="divide-y divide-border">
              <Row label="Course" value={courseName(student.courseId)} />
              <Row label="Sheet tab" value={course?.sheetTabName ?? "Not mapped"} />
              <Row label="Start date" value={formatDate(student.startDate)} />
              <Row label="Completion date" value={formatDate(student.completionDate)} />
              <Row
                label="Enrollment status"
                value={<StatusBadge status={student.enrollmentStatus} />}
              />
              <Row
                label="Certificate status"
                value={<StatusBadge status={student.certificateStatus} />}
              />
              <Row
                label="Certification sent"
                value={<StatusBadge status={student.certificationSent} />}
              />
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email history
            </h3>
            {emails.length === 0 ? (
              <p className="text-sm text-muted-foreground">No emails sent to this student yet.</p>
            ) : (
              <ul className="divide-y divide-border rounded-md border border-border">
                {emails.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{e.type} email</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(e.timestamp)}</p>
                    </div>
                    <StatusBadge status={e.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Activity timeline
            </h3>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recorded activity yet.</p>
            ) : (
              <ActivityTimeline items={activity} />
            )}
          </section>

          <p className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            Source records live in the existing Enrollment Records spreadsheet. This view is
            read-only — status changes happen through the enrollment and certificate workflows.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
