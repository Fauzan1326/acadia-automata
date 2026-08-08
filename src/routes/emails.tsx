import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Column, DataTable, SearchBar } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_EMAILS } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { retryEmail } from "@/services/gmail.service";
import type { EmailLog } from "@/lib/types";

export const Route = createFileRoute("/emails")({
  head: () => ({
    meta: [
      { title: "Email Manager — Enrollment Ops" },
      {
        name: "description",
        content:
          "Track enrollment and certificate emails, inspect failures and retry delivery through Gmail.",
      },
      { property: "og:title", content: "Email Manager — Enrollment Ops" },
      {
        property: "og:description",
        content: "Enrollment and certificate email delivery status with retry.",
      },
    ],
  }),
  component: EmailsPage,
});

type TabKey = "enrollment" | "certificate" | "failed" | "history";

function EmailsPage() {
  const [tab, setTab] = useState<TabKey>("enrollment");
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState<EmailLog[]>(MOCK_EMAILS);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return emails.filter((e) => {
      const matchesTab =
        tab === "history"
          ? true
          : tab === "failed"
            ? e.status === "Failed"
            : tab === "enrollment"
              ? e.type === "Enrollment"
              : e.type === "Certificate";
      const matchesQuery =
        !q ||
        e.studentName.toLowerCase().includes(q) ||
        e.recipient.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [emails, tab, query]);

  async function handleRetry(email: EmailLog) {
    setEmails((list) =>
      list.map((e) => (e.id === email.id ? { ...e, status: "Retrying" as const } : e)),
    );
    try {
      await retryEmail(email.id);
      setEmails((list) =>
        list.map((e) =>
          e.id === email.id ? { ...e, status: "Sent" as const, errorMessage: undefined } : e,
        ),
      );
      toast.success(`Email to ${email.recipient} was sent.`);
    } catch {
      setEmails((list) =>
        list.map((e) => (e.id === email.id ? { ...e, status: "Failed" as const } : e)),
      );
      toast.error("Gmail could not send this email. You can retry it again from Failed Emails.");
    }
  }

  const columns: Column<EmailLog>[] = [
    {
      key: "recipient",
      header: "Recipient",
      cell: (e) => <span className="font-medium">{e.recipient}</span>,
    },
    { key: "student", header: "Student", cell: (e) => e.studentName },
    { key: "type", header: "Email type", cell: (e) => `${e.type} email` },
    {
      key: "time",
      header: "Timestamp",
      sortValue: (e) => e.timestamp,
      cell: (e) => formatDateTime(e.timestamp),
    },
    {
      key: "status",
      header: "Status",
      cell: (e) => (
        <div className="space-y-1">
          <StatusBadge status={e.status} />
          {e.errorMessage && (
            <p className="max-w-[18rem] text-xs text-muted-foreground">{e.errorMessage}</p>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Action",
      cell: (e) =>
        e.status === "Failed" ? (
          <Button variant="outline" size="sm" className="h-8" onClick={() => handleRetry(e)}>
            <RotateCcw className="size-3.5" aria-hidden />
            Retry
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ];

  const failedCount = emails.filter((e) => e.status === "Failed").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Emails"
        description="All enrollment and certificate emails sent through Gmail. Credentials stay on the server."
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="enrollment">Enrollment emails</TabsTrigger>
          <TabsTrigger value="certificate">Certificate emails</TabsTrigger>
          <TabsTrigger value="failed">Failed emails ({failedCount})</TabsTrigger>
          <TabsTrigger value="history">Email history</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(e) => e.id}
        pageSize={12}
        emptyTitle="No emails in this view"
        toolbar={
          <SearchBar value={query} onChange={setQuery} placeholder="Search recipient or student" />
        }
      />
    </div>
  );
}
