import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, CalendarClock, CreditCard, LayoutDashboard, ListChecks, LogOut, Menu, MessageSquare, Moon, Sparkles, Star, Sun, User as UserIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

const studentNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { to: "/dashboard/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/orders", label: "Orders", icon: ListChecks },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star },
];

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/students", label: "Students", icon: UserIcon },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: LayoutDashboard },
];

export function DashboardShell({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const nav = admin ? adminNav : studentNav;
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const NavList = (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/50 bg-card/40 p-4 md:flex">
          <Link to="/" className="mb-6 flex items-center gap-2 font-bold">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="tracking-tight">Project Buddy</span>
          </Link>
          {NavList}
          <div className="mt-auto space-y-2 pt-4">
            <div className="rounded-lg border border-border/60 p-3">
              <div className="text-xs text-muted-foreground">Signed in as</div>
              <div className="truncate text-sm font-medium">{user?.name}</div>
              <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/50 bg-background/70 px-4 backdrop-blur md:px-6">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-4">
                  <div className="mb-6 flex items-center gap-2 font-bold">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <span>Project Buddy</span>
                  </div>
                  {NavList}
                </SheetContent>
              </Sheet>
              <h1 className="truncate text-sm font-medium text-muted-foreground">{admin ? "Admin" : "Student"} dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to={admin ? "/admin" : "/dashboard/notifications"} aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </header>
          <div className="p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}