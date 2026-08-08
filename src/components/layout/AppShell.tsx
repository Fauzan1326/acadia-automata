import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";
import { type ReactNode, useState } from "react";
import { SidebarBrand, SidebarNav } from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const notifications = MOCK_ACTIVITY.filter((a) => a.result !== "Success").slice(0, 5);

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <p className="border-t border-sidebar-border px-4 py-3 text-[11px] text-muted-foreground">
          Mock mode · no live credentials
        </p>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-surface/90 px-3 backdrop-blur sm:px-5">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBrand />
              <SidebarNav onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Label htmlFor="global-search" className="sr-only">
              Search students, courses, or certificates
            </Label>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="global-search"
              placeholder="Search students, courses, certificates"
              className="h-9 bg-card pl-8"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell className="size-5" aria-hidden />
                  {notifications.length > 0 && (
                    <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" aria-hidden />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <p className="border-b border-border px-3 py-2 text-sm font-medium">
                  Needs attention
                </p>
                <ul className="divide-y divide-border">
                  {notifications.map((n) => (
                    <li key={n.id} className="px-3 py-2.5">
                      <p className="text-sm leading-snug">{n.action}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDateTime(n.time)} · {n.module}
                      </p>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Administrator profile">
                  <UserRound className="size-5" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">Administrator</p>
                  <p className="text-xs text-muted-foreground">admin@mhssce.ac.in</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="size-4" aria-hidden />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-5 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
