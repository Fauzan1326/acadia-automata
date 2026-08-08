import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { COURSE_CONFIG } from "@/config/courses";
import {
  MOCK_CERTIFICATES,
  MOCK_COURSE_STATS,
  MOCK_EMAILS,
  MOCK_REGISTRATIONS,
  MOCK_STUDENTS,
} from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Enrollment Ops" },
      {
        name: "description",
        content:
          "Registration, enrollment, completion, certificate processing and delivery reporting for administrators.",
      },
      { property: "og:title", content: "Reports — Enrollment Ops" },
      {
        property: "og:description",
        content: "Course-wise enrollment, completion and certificate delivery reporting.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const chartData = COURSE_CONFIG.map((c) => {
    const stats = MOCK_COURSE_STATS.find((s) => s.courseId === c.id)!;
    return {
      course: c.sheetTabName,
      Students: stats.totalStudents,
      Pending: stats.pendingEnrollment,
      Completed: stats.completed,
    };
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Operational reporting derived from the existing spreadsheets. No decorative analytics."
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Registrations read" value={MOCK_REGISTRATIONS.length} />
        <StatCard label="Students enrolled" value={MOCK_STUDENTS.length} />
        <StatCard
          label="Completions"
          value={MOCK_STUDENTS.filter((s) => s.enrollmentStatus === "Completed").length}
        />
        <StatCard
          label="Certificates delivered"
          value={MOCK_CERTIFICATES.filter((c) => c.sent).length}
        />
        <StatCard
          label="Pending enrollment"
          value={
            MOCK_STUDENTS.filter(
              (s) =>
                s.enrollmentStatus === "Pending Enrollment" ||
                s.enrollmentStatus === "Emails Copied",
            ).length
          }
        />
        <StatCard
          label="Certificates in review"
          value={MOCK_CERTIFICATES.filter((c) => c.matchState !== "MATCHED").length}
        />
        <StatCard
          label="Certificates signed"
          value={MOCK_CERTIFICATES.filter((c) => c.signed).length}
        />
        <StatCard
          label="Failed emails"
          value={MOCK_EMAILS.filter((e) => e.status === "Failed").length}
        />
      </section>

      <section aria-labelledby="chart-heading" className="surface-card p-4">
        <h2 id="chart-heading" className="text-sm font-semibold">
          Course-wise enrollment
        </h2>
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="course"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={64}
              />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="Students" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Pending" fill="var(--color-chart-4)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Completed" fill="var(--color-chart-3)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section aria-labelledby="table-heading" className="surface-card overflow-hidden">
        <h2 id="table-heading" className="border-b border-border px-4 py-3 text-sm font-semibold">
          Course-wise certificate delivery
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-muted/60">
              <tr>
                {["Course", "Tab", "Students", "Completed", "Certificates sent"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="table-cell-tight text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COURSE_CONFIG.map((c) => {
                const stats = MOCK_COURSE_STATS.find((s) => s.courseId === c.id)!;
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="table-cell-tight font-medium">{c.courseName}</td>
                    <td className="table-cell-tight font-mono text-xs">{c.sheetTabName}</td>
                    <td className="table-cell-tight tabular-nums">{stats.totalStudents}</td>
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
