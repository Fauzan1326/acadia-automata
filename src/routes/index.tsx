import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileSignature,
  MailWarning,
  Send,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ActivityTimeline } from "@/components/shared/ActivityTimeline";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { COURSE_CONFIG } from "@/config/courses";
import {
  MOCK_ACTIVITY,
  MOCK_CERTIFICATES,
  MOCK_COURSE_STATS,
  MOCK_EMAILS,
  MOCK_REGISTRATIONS,
  MOCK_STUDENTS,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Enrollment Ops" },
      {
        name: "description",
        content:
          "Daily operations overview: new registrations, pending enrollment, certificates awaiting review, signing and delivery.",
      },
      { property: "og:title", content: "Dashboard — Enrollment Ops" },
      {
        property: "og:description",
        content: "Registration sync, enrollment batches and certificate delivery at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const newRegistrations = MOCK_REGISTRATIONS.filter((r) => r.syncState === "new").length;
  const pendingEnrollment = MOCK_STUDENTS.filter(
    (s) => s.enrollmentStatus === "Pending Enrollment" || s.enrollmentStatus === "Emails Copied",
  ).length;
  const waiting = MOCK_STUDENTS.filter(
    (s) => s.enrollmentStatus === "Waiting for Completion",
  ).length;
  const toReview = MOCK_CERTIFICATES.filter((c) => c.matchState !== "MATCHED").length;
  const signed = MOCK_CERTIFICATES.filter((c) => c.signed).length;
  const sent = MOCK_CERTIFICATES.filter((c) => c.sent).length;
  const completed = MOCK_STUDENTS.filter((s) => s.enrollmentStatus === "Completed").length;
  const failedEmails = MOCK_EMAILS.filter((e) => e.status === "Failed").length;
  const failedCerts = MOCK_CERTIFICATES.filter((c) => c.matchState === "INVALID FILE").length;

  const attention = [
    {
      label: "New registrations waiting for sync",
      count: newRegistrations,
      to: "/synchronization" as const,
      cta: "Open synchronization",
    },
    {
      label: "Students waiting for enrollment",
      count: pendingEnrollment,
      to: "/enrollment" as const,
      cta: "Open enrollment manager",
    },
    {
      label: "Certificates requiring review",
      count: toReview,
      to: "/review-queue" as const,
      cta: "Open review queue",
    },
    {
      label: "Failed emails",
      count: failedEmails,
      to: "/emails" as const,
      cta: "Open failed emails",
    },
    {
      label: "Failed certificate processing",
      count: failedCerts,
      to: "/certificates" as const,
      cta: "Open certificate manager",
    },
  ].filter((a) => a.count > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="What is new, what needs attention, and where every certificate stands today."
        actions={
          <Button asChild>
            <Link to="/synchronization">
              Sync new registrations
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        }
      />

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Total students" value={MOCK_STUDENTS.length} icon={Users} />
        <StatCard
          label="New registrations"
          value={newRegistrations}
          icon={UserPlus}
          emphasis={newRegistrations > 0}
          hint="Not yet synced to course tabs"
        />
        <StatCard label="Pending enrollment" value={pendingEnrollment} icon={Clock} />
        <StatCard label="Waiting for completion" value={waiting} icon={Clock} />
        <StatCard
          label="Certificates to review"
          value={toReview}
          icon={AlertTriangle}
          emphasis={toReview > 0}
        />
        <StatCard label="Certificates signed" value={signed} icon={FileSignature} />
        <StatCard label="Certificates sent" value={sent} icon={Send} />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section aria-labelledby="attention-heading" className="surface-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 id="attention-heading" className="text-sm font-semibold">
              Attention required
            </h2>
            <MailWarning className="size-4 text-muted-foreground" aria-hidden />
          </div>
          {attention.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nothing needs your attention right now.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {attention.map((item) => (
                <li
                  key={item.label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.count} item(s)</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link to={item.to}>{item.cta}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="activity-heading" className="surface-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 id="activity-heading" className="text-sm font-semibold">
              Recent activity
            </h2>
            <Button asChild variant="ghost" size="sm" className="h-8">
              <Link to="/activity-logs">View all</Link>
            </Button>
          </div>
          <div className="p-4">
            <ActivityTimeline items={MOCK_ACTIVITY.slice(0, 7)} />
          </div>
        </section>
      </div>

      <section aria-labelledby="courses-heading" className="surface-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 id="courses-heading" className="text-sm font-semibold">
            Course overview
          </h2>
          <Button asChild variant="ghost" size="sm" className="h-8">
            <Link to="/courses">
              <BadgeCheck className="size-4" aria-hidden />
              Manage courses
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-muted/60">
              <tr>
                {["Course", "Students", "Pending enrollment", "Completed", "Certificates sent"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="table-cell-tight text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {COURSE_CONFIG.map((course) => {
                const stats = MOCK_COURSE_STATS.find((s) => s.courseId === course.id)!;
                return (
                  <tr key={course.id} className="border-t border-border">
                    <td className="table-cell-tight">
                      <span className="font-medium">{course.courseName}</span>
                      {!course.tabPresent && (
                        <StatusBadge status="Failed" className="ml-2" showDot={false} />
                      )}
                    </td>
                    <td className="table-cell-tight tabular-nums">{stats.totalStudents}</td>
                    <td className="table-cell-tight tabular-nums">{stats.pendingEnrollment}</td>
                    <td className="table-cell-tight tabular-nums">{stats.completed}</td>
                    <td className="table-cell-tight tabular-nums">{stats.certificatesSent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
