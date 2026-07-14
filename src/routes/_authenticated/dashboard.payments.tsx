import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, API_BASE, ApiError, getToken } from "@/lib/api";
import { Loader2, QrCode } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  component: PaymentsPage,
});

type Payment = { _id: string; amount: number; transactionId: string; status: "pending" | "verified" | "rejected"; screenshot?: string; createdAt: string };
type QR = { image?: string };

const badge: Record<Payment["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  verified: "bg-green-500/15 text-green-500 border-green-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

function PaymentsPage() {
  const qc = useQueryClient();
  // const { data: qr } = useQuery({ queryKey: ["qr"], queryFn: () => api<{ qr: QR }>("/settings/qr") });
  const { data, isLoading } = useQuery({
    queryKey: ["me", "payments"],
    queryFn: () => api<{ payments: Payment[] }>("/payments/mine"),
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await api("/payments", { method: "POST", form: fd });
      toast.success("Payment submitted — awaiting verification.");
      (e.target as HTMLFormElement).reset();
      await qc.invalidateQueries({ queryKey: ["me", "payments"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  const qrSrc = "/QR.png";

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Scan the QR, pay, and submit your transaction proof.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/60 p-6 text-center">
            <h3 className="mb-2 font-semibold">Scan to pay</h3>
            {qrSrc ? (
              <img src={qrSrc} alt="Payment QR" className="mx-auto max-h-72 rounded-xl border border-border/60" />
            ) : (
              <div className="mx-auto grid h-56 w-56 place-items-center rounded-xl border border-dashed border-border/60 text-muted-foreground">
                <QrCode className="h-8 w-8" />
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Scan this QR code to make your payment.</p>
          </Card>

          <Card className="border-border/60 p-6">
            <h3 className="mb-3 font-semibold">Submit payment proof</h3>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input id="amount" name="amount" type="number" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input id="transactionId" name="transactionId" required className="mt-1.5" />
              </div>
              <div>
                {/* <Label htmlFor="screenshot">Screenshot</Label>
                <Input id="screenshot" name="screenshot" type="file" accept="image/*" required className="mt-1.5" /> */}
              </div>
              <Button type="submit" disabled={loading || !getToken()} className="bg-gradient-primary text-primary-foreground shadow-glow">
                {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Submit
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Recent payments</h3>
          {isLoading ? (
            <div className="grid gap-3">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
          ) : !data?.payments.length ? (
            <Card className="border-border/60 p-6 text-center text-muted-foreground">No payments yet.</Card>
          ) : (
            <div className="grid gap-3">
              {data.payments.map((p) => (
                <Card key={p._id} className="flex items-center justify-between border-border/60 p-4">
                  <div>
                    <div className="font-medium">₹{p.amount}</div>
                    <div className="text-xs text-muted-foreground">Txn {p.transactionId} • {new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="outline" className={badge[p.status]}>{p.status}</Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
