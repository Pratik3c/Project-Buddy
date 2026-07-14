import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);
    try {
      await api("/users/me", { method: "PATCH", body: fd });
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My profile</h1>
          <p className="text-sm text-muted-foreground">Keep your details up to date.</p>
        </div>
        <Card className="border-border/60 p-6">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <F label="Full name" name="name" defaultValue={user.name} />
            <F label="Email" name="email" type="email" defaultValue={user.email} disabled />
            <F label="Phone" name="phone" defaultValue={user.phone ?? ""} />
            <F label="City" name="city" defaultValue={user.city ?? ""} />
            <F label="College" name="college" defaultValue={user.college ?? ""} className="sm:col-span-2" />
            <F label="Branch" name="branch" defaultValue={user.branch ?? ""} />
            <F label="Year" name="year" defaultValue={user.year ?? ""} />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading} className="bg-gradient-primary text-primary-foreground shadow-glow">
                {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Save changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

function F({ label, name, type = "text", defaultValue, disabled, className }: { label: string; name: string; type?: string; defaultValue?: string; disabled?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} disabled={disabled} className="mt-1.5" />
    </div>
  );
}