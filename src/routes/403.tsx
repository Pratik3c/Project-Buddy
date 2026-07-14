import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/403")({
  component: Forbidden,
});

function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive"><ShieldAlert className="h-6 w-6" /></div>
        <h1 className="mt-6 text-3xl font-bold">403 — Forbidden</h1>
        <p className="mt-2 text-sm text-muted-foreground">You don't have permission to view this page.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </div>
    </div>
  );
}