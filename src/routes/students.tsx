import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Column, DataTable, FilterDropdown, SearchBar } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentDetails } from "@/components/shared/StudentDetails";
import { COURSE_CONFIG, courseName } from "@/config/courses";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — Enrollment Ops" },
      {
        name: "description",
        content:
          "Search, filter and inspect every student record across the 14 existing course tabs.",
      },
      { property: "og:title", content: "Students — Enrollment Ops" },
      {
        property: "og:description",
        content: "Student records, enrollment status and certificate status in one table.",
      },
    ],
  }),
  component: StudentsPage,
});

const ENROLLMENT_FILTERS = [
  "Pending Enrollment",
  "Emails Copied",
  "Enrollment Email Sent",
  "Waiting for Completion",
  "Completed",
];

function StudentsPage() {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Student | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_STUDENTS.filter((s) => {
      const matchesQuery =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.collegeEmailId.toLowerCase().includes(q) ||
        s.cprnNo.toLowerCase().includes(q);
      const matchesCourse = course === "all" || s.courseId === course;
      const matchesStatus = status === "all" || s.enrollmentStatus === status;
      return matchesQuery && matchesCourse && matchesStatus;
    });
  }, [query, course, status]);

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (s) => s.fullName,
      cell: (s) => <span className="font-medium">{s.fullName}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (s) => <span className="text-muted-foreground">{s.collegeEmailId}</span>,
    },
    { key: "branch", header: "Branch", sortValue: (s) => s.branch, cell: (s) => s.branch },
    { key: "year", header: "Year", cell: (s) => s.yearOfStudy },
    {
      key: "cprn",
      header: "CPRN",
      cell: (s) => <span className="font-mono text-xs">{s.cprnNo}</span>,
    },
    {
      key: "course",
      header: "Course",
      sortValue: (s) => courseName(s.courseId),
      cell: (s) => courseName(s.courseId),
    },
    { key: "start", header: "Start date", cell: (s) => formatDate(s.startDate) },
    { key: "completion", header: "Completion date", cell: (s) => formatDate(s.completionDate) },
    {
      key: "enrollment",
      header: "Enrollment status",
      cell: (s) => <StatusBadge status={s.enrollmentStatus} />,
    },
    {
      key: "certificate",
      header: "Certificate status",
      cell: (s) => <StatusBadge status={s.certificateStatus} />,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Students"
        description="Every record read from the existing course tabs. Select a student to see full history."
      />

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(s) => s.id}
        onRowClick={(s) => setSelected(s)}
        emptyTitle="No students match these filters"
        emptyDescription="Try clearing the search or choosing a different course."
        toolbar={
          <>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search name, email or CPRN"
            />
            <FilterDropdown
              label="Course"
              value={course}
              onChange={setCourse}
              options={[
                { value: "all", label: "All courses" },
                ...COURSE_CONFIG.map((c) => ({ value: c.id, label: c.courseName })),
              ]}
            />
            <FilterDropdown
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All statuses" },
                ...ENROLLMENT_FILTERS.map((s) => ({ value: s, label: s })),
              ]}
            />
            <p className="text-xs text-muted-foreground sm:ml-auto">
              {rows.length.toLocaleString()} of {MOCK_STUDENTS.length.toLocaleString()} students
            </p>
          </>
        }
      />

      <StudentDetails
        student={selected}
        open={selected !== null}
        onOpenChange={(v) => !v && setSelected(null)}
      />
    </div>
  );
}
