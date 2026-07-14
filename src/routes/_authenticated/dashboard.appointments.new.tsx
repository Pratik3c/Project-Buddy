import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, ApiError } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/appointments/new")({
  component: NewAppointment,
});

const schema = z.object({
  title: z.string().trim().min(2, "Project title is required").max(200),
  category: z.enum(["assignment", "major"]),
  technology: z.string().trim().min(1, "Technology is required").max(150),
  description: z.string().trim().min(10, "Please add a short description").max(3000),
  preferredDate: z.string().trim().min(1, "Pick a date"),
  preferredTime: z.string().trim().min(1, "Pick a time"),
  budget: z.string().trim().max(50).optional(),
});

function NewAppointment() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<"assignment" | "major">("assignment");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse({ ...fd, category });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api("/appointments", { method: "POST", body: parsed.data });
      toast.success("Consultation requested — we'll reach out soon.");
      navigate({ to: "/dashboard/appointments" });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book a consultation</h1>
          <p className="text-sm text-muted-foreground">Tell us about your project. Consultation is free.</p>
        </div>
        <Card className="border-border/60 p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Project title</Label>
              <Input id="title" name="title" className="mt-1.5" />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment">Assignment / Mini project</SelectItem>
                    <SelectItem value="major">Major project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="technology">Technology</Label>
                <Input id="technology" name="technology" placeholder="e.g. React + Node" className="mt-1.5" />
                {errors.technology && <p className="mt-1 text-xs text-destructive">{errors.technology}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={5} className="mt-1.5" placeholder="Describe your project, features, deadline…" />
              {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="preferredDate">Preferred date</Label>
                <Input id="preferredDate" name="preferredDate" type="date" className="mt-1.5" />
                {errors.preferredDate && <p className="mt-1 text-xs text-destructive">{errors.preferredDate}</p>}
              </div>
              <div>
                <Label htmlFor="preferredTime">Preferred time</Label>
                <Input id="preferredTime" name="preferredTime" type="time" className="mt-1.5" />
                {errors.preferredTime && <p className="mt-1 text-xs text-destructive">{errors.preferredTime}</p>}
              </div>
              <div>
                <Label htmlFor="budget">Budget (optional)</Label>
                <Input id="budget" name="budget" placeholder="₹" className="mt-1.5" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="bg-gradient-primary text-primary-foreground shadow-glow">
              {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Submit request
            </Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}