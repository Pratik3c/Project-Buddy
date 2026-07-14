import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Video, Check, X, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/appointments")({
  component: AdminAppointments,
});

type Appointment = {
  _id: string;
  title: string;
  category: string;
  technology?: string;
  description?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  preferredDate?: string;
  preferredTime?: string;
  budget?: string;
  student?: { _id: string; name: string; email: string; college?: string };
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  meetingNotes?: string;
  createdAt: string;
};

const badge: Record<Appointment["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  approved: "bg-primary/15 text-primary border-primary/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-green-500/15 text-green-500 border-green-500/30",
};

function AdminAppointments() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | Appointment["status"]>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "appointments", filter],
    queryFn: () => api<{ appointments: Appointment[] }>(`/admin/appointments${filter !== "all" ? `?status=${filter}` : ""}`),
  });

  async function updateStatus(id: string, status: Appointment["status"]) {
    try {
      await api(`/admin/appointments/${id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Marked as ${status}`);
      await qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    } catch {
      toast.error("Update failed");
    }
  }

  return (
    <DashboardShell admin>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid gap-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        ) : !data?.appointments.length ? (
          <Card className="border-border/60 p-10 text-center text-muted-foreground">No appointments.</Card>
        ) : (
          <div className="grid gap-3">
            {data.appointments.map((a) => (
              <Card key={a._id} className="border-border/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{a.title}</h3>
                      <Badge variant="outline" className={badge[a.status]}>{a.status}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {a.student?.name} • {a.student?.email} {a.student?.college && `• ${a.student.college}`}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{a.category} • {a.technology ?? "—"} • Preferred {a.preferredDate ?? "—"} {a.preferredTime ?? ""}</div>
                    {a.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ScheduleMeetDialog appt={a} onSaved={() => qc.invalidateQueries({ queryKey: ["admin", "appointments"] })} />
                    {a.status !== "approved" && <Button size="sm" variant="outline" onClick={() => updateStatus(a._id, "approved")}><Check className="mr-1 h-3.5 w-3.5" /> Approve</Button>}
                    {a.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => updateStatus(a._id, "rejected")}><X className="mr-1 h-3.5 w-3.5" /> Reject</Button>}
                    {a.status !== "completed" && <Button size="sm" variant="outline" onClick={() => updateStatus(a._id, "completed")}>Mark done</Button>}
                  </div>
                </div>
                {a.meetingLink && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                    <div><span className="font-medium">Meeting:</span> {a.meetingDate} at {a.meetingTime}</div>
                    <a className="inline-flex items-center gap-1 text-primary hover:underline" href={a.meetingLink} target="_blank" rel="noreferrer"><Video className="h-3.5 w-3.5" /> Open</a>
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

function ScheduleMeetDialog({ appt, onSaved }: { appt: Appointment; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);
    try {
      await api(`/admin/appointments/${appt._id}/schedule`, { method: "PATCH", body: fd });
      toast.success("Meeting scheduled — student notified by email.");
      setOpen(false);
      onSaved();
    } catch {
      toast.error("Could not schedule meeting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow"><Calendar className="mr-1 h-3.5 w-3.5" /> Schedule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Schedule Google Meet</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="meetingDate">Date</Label>
              <Input id="meetingDate" name="meetingDate" type="date" defaultValue={appt.meetingDate ?? appt.preferredDate} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="meetingTime">Time</Label>
              <Input id="meetingTime" name="meetingTime" type="time" defaultValue={appt.meetingTime ?? appt.preferredTime} required className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="meetingLink">Meet link</Label>
            <Input id="meetingLink" name="meetingLink" type="url" defaultValue={appt.meetingLink ?? ""} placeholder="https://meet.google.com/…" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="meetingNotes">Notes</Label>
            <Textarea id="meetingNotes" name="meetingNotes" defaultValue={appt.meetingNotes ?? ""} rows={3} className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-gradient-primary text-primary-foreground shadow-glow">Save & notify</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}