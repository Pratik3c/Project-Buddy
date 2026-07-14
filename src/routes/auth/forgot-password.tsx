import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, ApiError } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    setLoading(true);
    try {
      await api("/auth/forgot-password", { method: "POST", body: { email }, auth: false });
      setSent(true);
      toast.success("If an account exists, we've sent a reset link.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="We'll email you a reset link."
      footer={<>Remembered it? <Link to="/auth/login" className="text-primary hover:underline">Log in</Link></>}
    >
      {sent ? (
        <p className="text-center text-sm text-muted-foreground">Check your inbox for the reset link.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}