import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api, ApiError } from "@/lib/api";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  college: z.string().trim().min(1, "College is required").max(150),
  branch: z.string().trim().min(1, "Branch is required").max(100),
  year: z.string().trim().min(1, "Year is required").max(20),
  phone: z.string().trim().min(6, "Phone is required").max(20),
  email: z.string().trim().email("Invalid email").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path.join(".")] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api("/contact", { method: "POST", body: parsed.data, auth: false });
      toast.success("Message sent — I'll get back within 24 hours.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not send message. Please try again later.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" name="name" error={errors.name} />
      <Field label="Email" name="email" type="email" error={errors.email} />
      <Field label="Phone" name="phone" error={errors.phone} />
      <Field label="College" name="college" error={errors.college} />
      <Field label="Branch" name="branch" error={errors.branch} />
      <Field label="Year" name="year" placeholder="e.g. 3rd year" error={errors.year} />
      <div className="sm:col-span-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} className="mt-1.5" placeholder="Tell me about your project…" />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading} size="lg" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 sm:w-auto">
          {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Send message
        </Button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", placeholder, error }: { label: string; name: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} className="mt-1.5" />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}