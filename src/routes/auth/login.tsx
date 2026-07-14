import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(parsed.data.email, parsed.data.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate({ to: user.role === "admin" ? "/admin" : "/dashboard" });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your Project Buddy account"
      footer={<>Don't have an account? <Link to="/auth/signup" className="text-primary hover:underline">Sign up</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" className="mt-1.5" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</Link>
          </div>
          <Input id="password" name="password" type="password" className="mt-1.5" />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
          {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Log in
        </Button>
      </form>
    </AuthShell>
  );
}