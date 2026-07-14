import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/500")({
  component: ServerError,
});

function ServerError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-yellow-500/10 text-yellow-500"><AlertTriangle className="h-6 w-6" /></div>
        <h1 className="mt-6 text-3xl font-bold">500 — Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </div>
    </div>
  );
}