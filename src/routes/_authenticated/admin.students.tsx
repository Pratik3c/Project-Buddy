import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: StudentsPage,
});

type Student = { _id: string; name: string; email: string; phone?: string; college?: string; branch?: string; year?: string; createdAt: string };

function StudentsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "students", q],
    queryFn: () => api<{ students: Student[] }>(`/admin/students${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  });

  async function del(id: string) {
    try {
      await api(`/admin/students/${id}`, { method: "DELETE" });
      toast.success("Student deleted");
      await qc.invalidateQueries({ queryKey: ["admin", "students"] });
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <DashboardShell admin>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, email, college…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </div>
        <Card className="overflow-hidden border-border/60">
          {isLoading ? (
            <div className="p-6"><Skeleton className="h-24" /></div>
          ) : !data?.students.length ? (
            <div className="p-10 text-center text-muted-foreground">No students found.</div>
          ) : (
            <div className="divide-y divide-border/60">
              {data.students.map((s) => (
                <div key={s._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{s.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.email} • {s.phone ?? "—"}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.college} • {s.branch} • {s.year}</div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this student?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => del(s._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}