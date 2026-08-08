import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { IntegrationStatus } from "@/components/shared/IntegrationStatus";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_CONFIG, INTEGRATION_PLACEHOLDERS, SHEET_HEADERS } from "@/config/courses";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Enrollment Ops" },
      {
        name: "description",
        content:
          "Course to sheet-tab mapping, email templates, system preferences and integration health.",
      },
      { property: "og:title", content: "Settings — Enrollment Ops" },
      {
        property: "og:description",
        content: "Configuration for course mapping, email templates and integrations.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Configuration only. API keys, OAuth secrets and tokens are stored server-side and never displayed."
      />

      <section aria-labelledby="mapping-heading" className="surface-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h2 id="mapping-heading" className="text-sm font-semibold">
            Course / tab mapping
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Single source of truth for course → existing spreadsheet tab. Tabs are never renamed or
            deleted by this application.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-muted/60">
              <tr>
                {["Course name", "Sheet tab name", "Tab status"].map((h) => (
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
              {COURSE_CONFIG.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="table-cell-tight font-medium">{c.courseName}</td>
                  <td className="table-cell-tight font-mono text-xs">{c.sheetTabName}</td>
                  <td className="table-cell-tight">
                    <StatusBadge status={c.tabPresent ? "Yes" : "Failed"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="templates-heading" className="surface-card space-y-3 p-4">
          <h2 id="templates-heading" className="text-sm font-semibold">
            Email templates
          </h2>
          <div>
            <Label htmlFor="enrollment-template" className="text-xs text-muted-foreground">
              Enrollment email
            </Label>
            <Textarea
              id="enrollment-template"
              className="mt-1 min-h-28 bg-card font-mono text-xs"
              defaultValue={
                "Hello {{Full Name}},\n\nYou have been enrolled in {{Course}}. Please sign in to the course portal to begin.\n\nRegards,\nTraining Office"
              }
            />
          </div>
          <div>
            <Label htmlFor="certificate-template" className="text-xs text-muted-foreground">
              Certificate email
            </Label>
            <Textarea
              id="certificate-template"
              className="mt-1 min-h-28 bg-card font-mono text-xs"
              defaultValue={
                "Hello {{Full Name}},\n\nCongratulations on completing {{Course}}. Your signed certificate is attached.\n\nRegards,\nTraining Office"
              }
            />
          </div>
          <Button size="sm" onClick={() => toast.success("Email templates saved.")}>
            Save templates
          </Button>
        </section>

        <div className="space-y-5">
          <section aria-labelledby="prefs-heading" className="surface-card space-y-3 p-4">
            <h2 id="prefs-heading" className="text-sm font-semibold">
              System preferences
            </h2>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="pref-review" className="text-sm font-normal">
                Always review uncertain certificates before sending
              </Label>
              <Switch id="pref-review" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="pref-dupes" className="text-sm font-normal">
                Block duplicate enrollment batches per course
              </Label>
              <Switch id="pref-dupes" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="pref-notify" className="text-sm font-normal">
                Notify me about failed emails
              </Label>
              <Switch id="pref-notify" defaultChecked />
            </div>
          </section>

          <section aria-labelledby="integration-heading" className="space-y-3">
            <h2 id="integration-heading" className="text-sm font-semibold">
              Integration status
            </h2>
            <IntegrationStatus />
          </section>
        </div>
      </div>

      <section aria-labelledby="config-heading" className="surface-card p-4">
        <h2 id="config-heading" className="text-sm font-semibold">
          Configuration placeholders
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          These values must be supplied as server-side secrets before live integration. Nothing real
          is stored in the codebase.
        </p>
        <ul className="mt-3 space-y-1.5 font-mono text-xs">
          {Object.entries(INTEGRATION_PLACEHOLDERS).map(([key, value]) => (
            <li key={key} className="flex flex-wrap gap-2 break-all">
              <span className="text-muted-foreground">{key}</span>
              <span>= {value}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Existing headers (never modified): {SHEET_HEADERS.enrollmentRecords.join(" · ")}
        </p>
      </section>
    </div>
  );
}
