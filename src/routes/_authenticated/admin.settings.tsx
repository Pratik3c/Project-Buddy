import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, API_BASE, ApiError } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

type Settings = {
  heroTitle?: string;
  heroSubtitle?: string;
  pricingBasic?: string;
  pricingMajor?: string;
  contactEmail?: string;
  contactPhone?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  adminEmail?: string;
};

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api<{ settings: Settings; qr: { image?: string } }>("/settings"),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const s = data?.settings ?? {};
  const qrSrc = data?.qr?.image ? (data.qr.image.startsWith("http") ? data.qr.image : `${API_BASE.replace("/api", "")}${data.qr.image}`) : null;

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      await api("/admin/settings", { method: "PATCH", body: fd });
      toast.success("Settings saved");
      await qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally { setSaving(false); }
  }

  async function uploadQR(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setUploading(true);
    try {
      await api("/admin/settings/qr", { method: "POST", form: fd });
      toast.success("QR updated");
      (e.target as HTMLFormElement).reset();
      await qc.invalidateQueries({ queryKey: ["settings"] });
      await qc.invalidateQueries({ queryKey: ["qr"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Upload failed");
    } finally { setUploading(false); }
  }

  return (
    <DashboardShell admin>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

        <Card className="border-border/60 p-6">
          <h3 className="mb-3 font-semibold">Payment QR</h3>
          {qrSrc && <img src={qrSrc} alt="QR" className="mb-3 max-h-52 rounded-lg border border-border/60" />}
          <form onSubmit={uploadQR} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="image">Upload new QR image</Label>
              <Input id="image" name="image" type="file" accept="image/*" required className="mt-1.5" />
            </div>
            <Button type="submit" disabled={uploading} className="bg-gradient-primary text-primary-foreground shadow-glow">
              {uploading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Upload
            </Button>
          </form>
        </Card>

        <Card className="border-border/60 p-6">
          <h3 className="mb-3 font-semibold">Site settings</h3>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <F label="Hero title" name="heroTitle" defaultValue={s.heroTitle} className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <Label htmlFor="heroSubtitle">Hero subtitle</Label>
              <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={s.heroSubtitle ?? ""} rows={2} className="mt-1.5" />
            </div>
            <F label="Assignment starting price" name="pricingBasic" defaultValue={s.pricingBasic} />
            <F label="Major project starting price" name="pricingMajor" defaultValue={s.pricingMajor} />
            <F label="Contact email" name="contactEmail" type="email" defaultValue={s.contactEmail} />
            <F label="Contact phone" name="contactPhone" defaultValue={s.contactPhone} />
            <F label="LinkedIn URL" name="linkedin" defaultValue={s.linkedin} />
            <F label="GitHub URL" name="github" defaultValue={s.github} />
            <F label="Instagram URL" name="instagram" defaultValue={s.instagram} />
            <F label="Admin notification email" name="adminEmail" type="email" defaultValue={s.adminEmail} />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving} className="bg-gradient-primary text-primary-foreground shadow-glow">
                {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Save
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

function F({ label, name, type = "text", defaultValue, className }: { label: string; name: string; type?: string; defaultValue?: string; className?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} className="mt-1.5" />
    </div>
  );
}