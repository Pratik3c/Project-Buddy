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

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Name is required").max(100),
    email: z.string().trim().email(),
    phone: z.string().trim().min(6).max(20),
    college: z.string().trim().min(2).max(150),
    branch: z.string().trim().min(2).max(100),
    year: z.string().trim().min(1).max(20),
    city: z.string().trim().min(2).max(100),
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });

function SignupPage() {
  const { signup } = useAuth();
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
      const { confirmPassword: _cp, ...payload } = parsed.data;
      void _cp;
      await signup(payload);
      toast.success("Account created — welcome!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get personalised help with your college project"
      footer={<>Already have an account? <Link to="/auth/login" className="text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <F label="Full name" name="name" e={errors.name} className="sm:col-span-2" />
        <F label="Email" name="email" type="email" e={errors.email} />
        <F label="Phone" name="phone" e={errors.phone} />
        <F label="College" name="college" e={errors.college} className="sm:col-span-2" />
        <F label="Branch" name="branch" e={errors.branch} />
        <F label="Year" name="year" e={errors.year} placeholder="e.g. 3rd year" />
        <F label="City" name="city" e={errors.city} className="sm:col-span-2" />
        <F label="Password" name="password" type="password" e={errors.password} />
        <F label="Confirm password" name="confirmPassword" type="password" e={errors.confirmPassword} />
        <div className="sm:col-span-2">
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Create account
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}

function F({ label, name, type = "text", e, placeholder, className }: { label: string; name: string; type?: string; e?: string; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} className="mt-1.5" />
      {e && <p className="mt-1 text-xs text-destructive">{e}</p>}
    </div>
  );
}