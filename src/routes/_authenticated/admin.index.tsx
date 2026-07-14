import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { CalendarClock, CreditCard, IndianRupee, Star, Users, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

type AdminStats = {
  students: number;
  appointments: number;
  pending: number;
  payments: number;
  reviews: number;
  revenue: number;
};

function AdminHome() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api<{ stats: AdminStats }>("/admin/stats"),
  });
  const s = data?.stats;

  return (
    <DashboardShell admin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your students, appointments and revenue.</p>
        </div>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat icon={Users} label="Registered students" value={s?.students ?? 0} />
            <Stat icon={CalendarClock} label="Appointments" value={s?.appointments ?? 0} />
            <Stat icon={ClipboardList} label="Pending requests" value={s?.pending ?? 0} />
            <Stat icon={CreditCard} label="Payments" value={s?.payments ?? 0} />
            <Stat icon={Star} label="Reviews" value={s?.reviews ?? 0} />
            <Stat icon={IndianRupee} label="Revenue" value={`₹${(s?.revenue ?? 0).toLocaleString()}`} />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number | string }) {
  return (
    <Card className="border-border/60 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </Card>
  );
}