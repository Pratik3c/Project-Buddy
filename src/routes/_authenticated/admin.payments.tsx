import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, API_BASE } from "@/lib/api";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: AdminPayments,
});

type Payment = {
  _id: string;
  amount: number;
  transactionId: string;
  status: "pending" | "verified" | "rejected";
  screenshot?: string;
  createdAt: string;
  student?: { name: string; email: string };
};

const badge: Record<Payment["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  verified: "bg-green-500/15 text-green-500 border-green-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

function AdminPayments() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | Payment["status"]>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payments", filter],
    queryFn: () => api<{ payments: Payment[] }>(`/admin/payments${filter !== "all" ? `?status=${filter}` : ""}`),
  });

  async function update(id: string, status: Payment["status"]) {
    try {
      await api(`/admin/payments/${id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Marked ${status}`);
      await qc.invalidateQueries({ queryKey: ["admin", "payments"] });
    } catch {
      toast.error("Update failed");
    }
  }

  const src = (s?: string) => (s ? (s.startsWith("http") ? s : `${API_BASE.replace("/api", "")}${s}`) : null);

  return (
    <DashboardShell admin>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid gap-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        ) : !data?.payments.length ? (
          <Card className="border-border/60 p-10 text-center text-muted-foreground">No payments.</Card>
        ) : (
          <div className="grid gap-3">
            {data.payments.map((p) => (
              <Card key={p._id} className="border-border/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-xl font-bold">₹{p.amount}</div>
                      <Badge variant="outline" className={badge[p.status]}>{p.status}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{p.student?.name} • {p.student?.email}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Txn: {p.transactionId} • {new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* {p.screenshot && (
                      <a href={src(p.screenshot) ?? "#"} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline">View screenshot</Button>
                      </a>
                    )} */}
                    {p.status !== "verified" && <Button size="sm" onClick={() => update(p._id, "verified")}><Check className="mr-1 h-3.5 w-3.5" /> Verify</Button>}
                    {p.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => update(p._id, "rejected")}><X className="mr-1 h-3.5 w-3.5" /> Reject</Button>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}