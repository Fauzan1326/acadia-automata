import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Column, DataTable, FilterDropdown, SearchBar } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import type { ActivityLog } from "@/lib/types";

export const Route = createFileRoute("/activity-logs")({
  head: () => ({
    meta: [
      { title: "Activity Logs — Enrollment Ops" },
      {
        name: "description",
        content:
          "Auditable record of every administrative action across synchronization, enrollment, email and certificate modules.",
      },
      { property: "og:title", content: "Activity Logs — Enrollment Ops" },
      {
        property: "og:description",
        content: "Who did what, when, and whether it succeeded.",
      },
    ],
  }),
  component: ActivityLogsPage,
});

const MODULES = [
  "Synchronization",
  "Enrollment Manager",
  "Email Manager",
  "Certificate Manager",
  "Review Queue",
  "Settings",
];

function ActivityLogsPage() {
  const [query, setQuery] = useState("");
  const [module, setModule] = useState("all");
  const [result, setResult] = useState("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_ACTIVITY.filter((a) => {
      const matchesQuery =
        !q || a.action.toLowerCase().includes(q) || (a.student ?? "").toLowerCase().includes(q);
      return (
        matchesQuery &&
        (module === "all" || a.module === module) &&
        (result === "all" || a.result === result)
      );
    });
  }, [query, module, result]);

  const columns: Column<ActivityLog>[] = [
    { key: "time", header: "Time", sortValue: (a) => a.time, cell: (a) => formatDateTime(a.time) },
    { key: "admin", header: "Admin", cell: (a) => a.admin },
    { key: "action", header: "Action", cell: (a) => <span className="font-medium">{a.action}</span> },
    { key: "module", header: "Module", cell: (a) => a.module },
    { key: "student", header: "Student", cell: (a) => a.student ?? "—" },
    { key: "result", header: "Result", cell: (a) => <StatusBadge status={a.result} /> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Activity Logs"
        description="Every administrative action is recorded for audit and troubleshooting."
      />
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(a) => a.id}
        pageSize={15}
        toolbar={
          <>
            <SearchBar value={query} onChange={setQuery} placeholder="Search action or student" />
            <FilterDropdown
              label="Module"
              value={module}
              onChange={setModule}
              options={[
                { value: "all", label: "All modules" },
                ...MODULES.map((m) => ({ value: m, label: m })),
              ]}
            />
            <FilterDropdown
              label="Result"
              value={result}
              onChange={setResult}
              options={[
                { value: "all", label: "All results" },
                { value: "Success", label: "Success" },
                { value: "Warning", label: "Warning" },
                { value: "Failed", label: "Failed" },
              ]}
            />
          </>
        }
      />
    </div>
  );
}
