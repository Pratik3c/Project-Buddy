import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: AdminMessages,
});

type M = { _id: string; name: string; email: string; phone?: string; college?: string; branch?: string; year?: string; message: string; createdAt: string };

function AdminMessages() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => api<{ messages: M[] }>("/admin/messages"),
  });

  return (
    <DashboardShell admin>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Contact messages</h1>
        {isLoading ? (
          <div className="grid gap-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        ) : !data?.messages.length ? (
          <Card className="border-border/60 p-10 text-center text-muted-foreground">No messages yet.</Card>
        ) : (
          <div className="grid gap-3">
            {data.messages.map((m) => (
              <Card key={m._id} className="border-border/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{m.email} • {m.phone ?? "—"} • {m.college ?? "—"} • {m.branch ?? "—"} {m.year && `• ${m.year}`}</div>
                <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}