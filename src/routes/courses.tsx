import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, TableProperties } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { COURSE_CONFIG } from "@/config/courses";
import { MOCK_COURSE_STATS } from "@/lib/mock-data";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Enrollment Ops" },
      {
        name: "description",
        content:
          "The 14 existing courses with their mapped spreadsheet tabs, student counts and certificate progress.",
      },
      { property: "og:title", content: "Courses — Enrollment Ops" },
      {
        property: "og:description",
        content: "Course to sheet-tab mapping and per-course enrollment progress.",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const missing = COURSE_CONFIG.filter((c) => !c.tabPresent);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Courses"
        description="Existing courses and their mapped tabs in the Enrollment Records spreadsheet. Tabs are never renamed or deleted by this application."
        actions={
          <Button asChild variant="outline">
            <Link to="/settings">
              <TableProperties className="size-4" aria-hidden />
              Course mapping
            </Link>
          </Button>
        }
      />

      {missing.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-3.5"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <div className="min-w-0 text-sm">
            <p className="font-medium">
              {missing.length} course tab could not be found in the spreadsheet
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {missing.map((c) => `${c.courseName} → "${c.sheetTabName}"`).join(", ")}. No data will
              be written to these courses until the mapping is corrected in Settings.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {COURSE_CONFIG.map((course) => {
          const stats = MOCK_COURSE_STATS.find((s) => s.courseId === course.id)!;
          return (
            <article key={course.id} className="surface-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">{course.courseName}</h2>
                  <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                    Tab: {course.sheetTabName}
                  </p>
                </div>
                {!course.tabPresent && (
                  <span className="shrink-0 rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Tab missing
                  </span>
                )}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Total students</dt>
                  <dd className="font-semibold tabular-nums">{stats.totalStudents}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Pending enrollment</dt>
                  <dd className="font-semibold tabular-nums">{stats.pendingEnrollment}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Completed</dt>
                  <dd className="font-semibold tabular-nums">{stats.completed}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Certificates sent</dt>
                  <dd className="font-semibold tabular-nums">{stats.certificatesSent}</dd>
                </div>
              </dl>

              <Button asChild variant="outline" size="sm" className="mt-4 h-8 w-full">
                <Link to="/enrollment">Open enrollment workflow</Link>
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
