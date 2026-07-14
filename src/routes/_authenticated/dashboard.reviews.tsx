import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError } from "@/lib/api";
import { Star, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/reviews")({
  component: ReviewsPage,
});

type MyReview = { _id: string; rating: number; comment: string; approved: boolean; createdAt: string };

function ReviewsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me", "reviews"],
    queryFn: () => api<{ reviews: MyReview[] }>("/reviews/mine"),
  });
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const comment = String(new FormData(e.currentTarget).get("comment") ?? "").trim();
    if (comment.length < 5) return toast.error("Please write a longer review.");
    setLoading(true);
    try {
      await api("/reviews", { method: "POST", body: { rating, comment } });
      toast.success("Thanks! Your review is pending approval.");
      (e.target as HTMLFormElement).reset();
      setRating(5);
      await qc.invalidateQueries({ queryKey: ["me", "reviews"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My reviews</h1>
          <p className="text-sm text-muted-foreground">Share your experience — reviews go live after admin approval.</p>
        </div>
        <Card className="border-border/60 p-6">
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <div className="mb-2 text-sm font-medium">Rating</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button key={v} type="button" onClick={() => setRating(v)} className="p-1">
                    <Star className={`h-6 w-6 ${v <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <Textarea name="comment" rows={4} placeholder="How was your Project Buddy experience?" />
            <Button type="submit" disabled={loading} className="bg-gradient-primary text-primary-foreground shadow-glow">
              {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Submit review
            </Button>
          </form>
        </Card>

        <div>
          <h3 className="mb-3 font-semibold">Previous reviews</h3>
          {isLoading ? (
            <Skeleton className="h-24 rounded-xl" />
          ) : !data?.reviews.length ? (
            <Card className="border-border/60 p-6 text-center text-muted-foreground">You haven't left a review yet.</Card>
          ) : (
            <div className="grid gap-3">
              {data.reviews.map((r) => (
                <Card key={r._id} className="border-border/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-primary" : "opacity-30"}`} />)}
                    </div>
                    <span className={`text-xs ${r.approved ? "text-green-500" : "text-yellow-500"}`}>{r.approved ? "Approved" : "Pending approval"}</span>
                  </div>
                  <p className="mt-2 text-sm">"{r.comment}"</p>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}