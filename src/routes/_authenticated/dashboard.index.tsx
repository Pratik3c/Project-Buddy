import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { ArrowRight, CalendarClock, CreditCard, ListChecks, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
});

type Stats = { appointments: number; pending: number; payments: number; orders: number };

function DashboardHome() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["me", "stats"],
    queryFn: () => api<{ stats: Stats }>("/users/stats"),
  });
  const stats = data?.stats;

  return (
    <DashboardShell>
      <div className="space-y-8">
        <Card className="relative overflow-hidden border-border/60 p-8">
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-primary opacity-10" />
          <div className="text-xs uppercase tracking-widest text-primary">Welcome</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Hi {user?.name?.split(" ")[0] ?? "there"} 👋</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Book a consultation, track appointments and manage your projects — all in one place.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow"><Link to="/dashboard/appointments/new">Book a consultation <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link to="/dashboard/orders">View orders</Link></Button>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarClock} label="Appointments" value={stats?.appointments ?? "—"} />
          <StatCard icon={ListChecks} label="Pending" value={stats?.pending ?? "—"} />
          <StatCard icon={CreditCard} label="Payments" value={stats?.payments ?? "—"} />
          <StatCard icon={Star} label="Orders" value={stats?.orders ?? "—"} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <QuickCard title="My appointments" href="/dashboard/appointments" desc="View and manage your consultation requests." />
          <QuickCard title="Payments" href="/dashboard/payments" desc="Upload transaction proof and view status." />
          <QuickCard title="Notifications" href="/dashboard/notifications" desc="Meeting scheduled, project updates and more." />
          <QuickCard title="Reviews" href="/dashboard/reviews" desc="Share your experience once your project ships." />
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: string | number }) {
  return (
    <Card className="border-border/60 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </Card>
  );
}

function QuickCard({ title, href, desc }: { title: string; href: string; desc: string }) {
  return (
    <Card className="border-border/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </div>
        <Button asChild variant="ghost" size="sm"><Link to={href}>Open <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
      </div>
    </Card>
  );
}