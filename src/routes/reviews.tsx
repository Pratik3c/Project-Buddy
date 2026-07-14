import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { SectionHeading } from "./index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Lock, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Project Buddy" },
      { name: "description", content: "Verified reviews from students who worked with Project Buddy." },
      { property: "og:title", content: "Reviews — Project Buddy" },
      { property: "og:description", content: "Real feedback from real students." },
    ],
  }),
  component: ReviewsPage,
});

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student?: { name?: string; college?: string };
  project?: string;
};

function ReviewsPage() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Reviews" title="Verified student reviews" />
        {loading ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : !isAuthenticated ? (
          <Card className="mt-10 flex flex-col items-center gap-4 border-border/60 p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Login to view verified student reviews.</p>
            <div className="flex gap-3">
              <Button asChild><Link to="/auth/login">Log in</Link></Button>
              <Button asChild variant="outline"><Link to="/auth/signup">Create account</Link></Button>
            </div>
          </Card>
        ) : (
          <ReviewsList />
        )}
      </section>
    </SiteLayout>
  );
}

function ReviewsList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", "public"],
    queryFn: () => api<{ reviews: Review[] }>("/reviews"),
  });
  if (isLoading) {
    return (
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
      </div>
    );
  }
  if (isError) {
    return <p className="mt-10 text-center text-sm text-muted-foreground">Could not load reviews. Try again later.</p>;
  }
  const reviews = data?.reviews ?? [];
  if (reviews.length === 0) {
    return <p className="mt-10 text-center text-sm text-muted-foreground">No approved reviews yet.</p>;
  }
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <Card key={r._id} className="border-border/60 p-5">
          <div className="flex items-center gap-1 text-primary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-primary" : "opacity-30"}`} />
            ))}
          </div>
          <p className="mt-3 text-sm">"{r.comment}"</p>
          <div className="mt-4 text-xs text-muted-foreground">
            <div className="font-medium text-foreground">{r.student?.name ?? "Student"}</div>
            {r.student?.college && <div>{r.student.college}</div>}
            {r.project && <div className="mt-0.5">Project: {r.project}</div>}
            <div className="mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}