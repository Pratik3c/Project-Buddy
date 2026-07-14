import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Bell, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/notifications")({
  component: NotificationsPage,
});

type N = { _id: string; title: string; message: string; read: boolean; createdAt: string };

function NotificationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me", "notifications"],
    queryFn: () => api<{ notifications: N[] }>("/notifications"),
  });

  async function markAll() {
    await api("/notifications/read-all", { method: "POST" });
    await qc.invalidateQueries({ queryKey: ["me", "notifications"] });
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">Updates on your appointments, payments and projects.</p>
          </div>
          <Button variant="outline" size="sm" onClick={markAll}><CheckCheck className="mr-1 h-4 w-4" /> Mark all read</Button>
        </div>
        {isLoading ? (
          <div className="grid gap-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : !data?.notifications.length ? (
          <Card className="border-border/60 p-10 text-center text-muted-foreground">
            <Bell className="mx-auto mb-3 h-8 w-8" /> You're all caught up.
          </Card>
        ) : (
          <div className="grid gap-3">
            {data.notifications.map((n) => (
              <Card key={n._id} className={`border-border/60 p-4 ${!n.read ? "border-primary/40 bg-primary/5" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{n.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{n.message}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}