import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/auth-shell";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/verify-email")({
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <AuthShell title="Verify your email" subtitle="Placeholder verification flow">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
          <MailCheck className="h-6 w-6 text-primary" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Email verification is wired up on the backend and can be enabled by hooking your
          verification token endpoint. Continue to your dashboard for now.
        </p>
        <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow"><Link to="/dashboard">Continue</Link></Button>
      </div>
    </AuthShell>
  );
}