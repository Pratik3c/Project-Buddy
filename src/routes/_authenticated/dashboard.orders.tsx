import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/dashboard/orders")({
  component: OrdersPage,
});

const STAGES = ["requirements", "development", "documentation", "testing", "completed"] as const;
type Stage = (typeof STAGES)[number];
type Order = { _id: string; title: string; stage: Stage; updatedAt: string };

const label: Record<Stage, string> = {
  requirements: "Requirement Discussion",
  development: "Development Started",
  documentation: "Documentation",
  testing: "Testing",
  completed: "Completed",
};

function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["me", "orders"],
    queryFn: () => api<{ orders: Order[] }>("/appointments/orders"),
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project orders</h1>
          <p className="text-sm text-muted-foreground">Track how each project is progressing.</p>
        </div>
        {isLoading ? (
          <div className="grid gap-3">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
        ) : !data?.orders.length ? (
          <Card className="border-border/60 p-10 text-center text-muted-foreground">No active orders yet.</Card>
        ) : (
          <div className="grid gap-4">
            {data.orders.map((o) => {
              const idx = STAGES.indexOf(o.stage);
              const pct = ((idx + 1) / STAGES.length) * 100;
              return (
                <Card key={o._id} className="border-border/60 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{o.title}</h3>
                    <div className="text-xs text-muted-foreground">Last update {new Date(o.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-4">
                    <Progress value={pct} />
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
                      {STAGES.map((s, i) => (
                        <div key={s} className={`rounded-md border px-2 py-1.5 text-center ${i <= idx ? "border-primary/40 bg-primary/5 text-primary" : "border-border/60 text-muted-foreground"}`}>
                          {label[s]}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}