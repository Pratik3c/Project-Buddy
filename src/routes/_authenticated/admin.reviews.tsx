import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Check, Star, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

type Review = { _id: string; rating: number; comment: string; approved: boolean; createdAt: string; student?: { name?: string; college?: string } };

function AdminReviews() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: () => api<{ reviews: Review[] }>("/admin/reviews"),
  });

  async function approve(id: string, approved: boolean) {
    try {
      await api(`/admin/reviews/${id}`, { method: "PATCH", body: { approved } });
      toast.success(approved ? "Approved" : "Unapproved");
      await qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    } catch { toast.error("Failed"); }
  }
  async function del(id: string) {
    try {
      await api(`/admin/reviews/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      await qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    } catch { toast.error("Delete failed"); }
  }

  return (
    <DashboardShell admin>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        {isLoading ? (
          <div className="grid gap-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
        ) : !data?.reviews.length ? (
          <Card className="border-border/60 p-10 text-center text-muted-foreground">No reviews yet.</Card>
        ) : (
          <div className="grid gap-3">
            {data.reviews.map((r) => (
              <Card key={r._id} className="border-border/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-primary" : "opacity-30"}`} />)}
                      </div>
                      <Badge variant="outline" className={r.approved ? "border-green-500/30 bg-green-500/10 text-green-500" : "border-yellow-500/30 bg-yellow-500/10 text-yellow-500"}>
                        {r.approved ? "approved" : "pending"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">"{r.comment}"</p>
                    <div className="mt-1 text-xs text-muted-foreground">{r.student?.name} {r.student?.college && `• ${r.student.college}`} • {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.approved ? (
                      <Button size="sm" variant="outline" onClick={() => approve(r._id, false)}><X className="mr-1 h-3.5 w-3.5" /> Unapprove</Button>
                    ) : (
                      <Button size="sm" onClick={() => approve(r._id, true)}><Check className="mr-1 h-3.5 w-3.5" /> Approve</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => del(r._id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
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