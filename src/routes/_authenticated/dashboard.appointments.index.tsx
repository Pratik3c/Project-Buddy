import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { CalendarPlus, Clock, Video } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/appointments/")({
  component: AppointmentsPage,
});

export type Appointment = {
  _id: string;
  title: string;
  category: "assignment" | "major";
  technology?: string;
  description?: string;
  budget?: string;
  preferredDate?: string;
  preferredTime?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  meetingNotes?: string;
  createdAt: string;
};

const statusColor: Record<Appointment["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  approved: "bg-primary/15 text-primary border-primary/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-green-500/15 text-green-500 border-green-500/30",
};

function AppointmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["me", "appointments"],
    queryFn: () => api<{ appointments: Appointment[] }>("/appointments/mine"),
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My appointments</h1>
            <p className="text-sm text-muted-foreground">Consultation requests and their status.</p>
          </div>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/dashboard/appointments/new"><CalendarPlus className="mr-1 h-4 w-4" /> New request</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : !data?.appointments.length ? (
          <Card className="border-border/60 p-10 text-center">
            <p className="text-muted-foreground">No appointments yet.</p>
            <Button asChild className="mt-4"><Link to="/dashboard/appointments/new">Book your first consultation</Link></Button>
          </Card>
        ) : (
          <div className="grid gap-3">
            {data.appointments.map((a) => (
              <Card key={a._id} className="border-border/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">{a.title}</h3>
                      <Badge variant="outline" className={statusColor[a.status]}>{a.status}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {a.category === "major" ? "Major project" : "Assignment / Mini"} • {a.technology ?? "—"}
                    </div>
                    {a.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 justify-end"><Clock className="h-3 w-3" /> {new Date(a.createdAt).toLocaleDateString()}</div>
                    {a.preferredDate && <div className="mt-1">Preferred: {a.preferredDate} {a.preferredTime ?? ""}</div>}
                  </div>
                </div>
                {a.meetingLink && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                    <div>
                      <div className="font-medium">Meeting scheduled</div>
                      <div className="text-xs text-muted-foreground">{a.meetingDate} at {a.meetingTime}</div>
                    </div>
                    <Button asChild size="sm"><a href={a.meetingLink} target="_blank" rel="noreferrer"><Video className="mr-1 h-3.5 w-3.5" /> Join</a></Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}