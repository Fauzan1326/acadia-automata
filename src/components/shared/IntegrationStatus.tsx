import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_SYSTEM_STATUS } from "@/lib/mock-data";

const ROWS = [
  {
    label: "Google Sheets API",
    state: MOCK_SYSTEM_STATUS.googleSheets,
    note: "Reads the form response sheet and existing course tabs",
  },
  {
    label: "Gmail API",
    state: MOCK_SYSTEM_STATUS.gmail,
    note: "Sends enrollment and certificate emails",
  },
  {
    label: "Certificate Signer",
    state: MOCK_SYSTEM_STATUS.certificateSigner,
    note: "Existing signing module used through an adapter",
  },
];

export function IntegrationStatus() {
  return (
    <div className="surface-card divide-y divide-border">
      {ROWS.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3.5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.label}</p>
            <p className="truncate text-xs text-muted-foreground">{row.note}</p>
          </div>
          <StatusBadge status={row.state} />
        </div>
      ))}
      <p className="p-3.5 text-xs text-muted-foreground">
        The application is running in mock mode. Live credentials and spreadsheet identifiers are
        supplied through server-side secrets and are never shown here.
      </p>
    </div>
  );
}
