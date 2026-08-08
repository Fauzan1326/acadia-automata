import { ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/States";
import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  label = "Search",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full sm:w-64", className)}>
      <Label className="sr-only" htmlFor="table-search">
        {label}
      </Label>
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="table-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 bg-card pl-8"
      />
    </div>
  );
}

export function FilterDropdown({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("w-full sm:w-auto", className)}>
      <Label className="sr-only" htmlFor={`filter-${label}`}>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={`filter-${label}`} className="h-9 w-full bg-card sm:w-48">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5">
      <p className="text-xs text-muted-foreground">
        {total.toLocaleString()} record{total === 1 ? "" : "s"} · page {page} of {pageCount || 1}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  toolbar,
  onRowClick,
  pageSize = 12,
  emptyTitle = "No records found",
  emptyDescription,
}: {
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      return av === bv ? 0 : av > bv ? dir : -dir;
    });
  }, [rows, columns, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      {toolbar && (
        <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row sm:flex-wrap sm:items-center">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-muted/60">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "table-cell-tight whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                    c.headerClassName,
                  )}
                >
                  {c.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      aria-label={`Sort by ${c.header}`}
                      className="inline-flex items-center gap-1 rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {c.header}
                      <ChevronsUpDown className="size-3" aria-hidden />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === "Enter") onRowClick(row);
                      }
                    : undefined
                }
                className={cn(
                  "border-t border-border align-middle",
                  onRowClick &&
                    "cursor-pointer transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
                )}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("table-cell-tight", c.className)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visible.length === 0 && (
        <EmptyState title={emptyTitle} {...(emptyDescription ? { description: emptyDescription } : {})} />
      )}
      {visible.length > 0 && (
        <Pagination
          page={current}
          pageCount={pageCount}
          total={sorted.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
