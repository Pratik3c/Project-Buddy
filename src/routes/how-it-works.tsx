import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { SectionHeading } from "./index";
import { Card } from "@/components/ui/card";
import { Handwritten, CurvedArrow } from "@/components/site/handwritten";

const steps = ["Register", "Book Free Consultation", "Discuss Requirements", "Receive Quotation", "Payment", "Project Development", "Delivery", "Support & Explanation"];

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Project Buddy" },
      { name: "description", content: "From registration to viva prep — the 8-step Project Buddy workflow." },
      { property: "og:title", content: "How it works — Project Buddy" },
      { property: "og:description", content: "The clear path from idea to submission." },
    ],
  }),
  component: HowPage,
});

function HowPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="How it works" title="A clear path from idea to submission" />
        <div className="mx-auto mt-3 flex w-fit items-center gap-2">
          <CurvedArrow className="h-8 w-10 text-primary/60" flip />
          <Handwritten className="text-2xl">step by step</Handwritten>
        </div>
        <ol className="mt-12 space-y-4">
          {steps.map((s, i) => (
            <Card key={s} className="flex items-center gap-4 border-border/60 p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
                {i + 1}
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Step {i + 1}</div>
                <div className="text-lg font-semibold">{s}</div>
              </div>
            </Card>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}