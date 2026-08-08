import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BadgeCheck,
  BookOpen,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  Mail,
  RefreshCcw,
  Settings,
  ShieldQuestion,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof Users; exact?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/synchronization", label: "Synchronization", icon: RefreshCcw },
  { to: "/enrollment", label: "Enrollment", icon: ClipboardList },
  { to: "/emails", label: "Emails", icon: Mail },
  { to: "/certificates", label: "Certificates", icon: BadgeCheck },
  { to: "/review-queue", label: "Review Queue", icon: ShieldQuestion },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/activity-logs", label: "Activity Logs", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-0.5 px-2 py-3">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to as "/"}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              active && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-3.5">
      <span
        className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground"
        aria-hidden
      >
        EC
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-tight">Enrollment Ops</p>
        <p className="truncate text-[11px] text-muted-foreground">Certificate Automation</p>
      </div>
    </div>
  );
}
