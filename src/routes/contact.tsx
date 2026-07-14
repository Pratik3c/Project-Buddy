import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { SectionHeading } from "./index";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/site/contact-form";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Project Buddy" },
      { name: "description", content: "Reach out for a free consultation about your college project." },
      { property: "og:title", content: "Contact — Project Buddy" },
      { property: "og:description", content: "Send a message and we'll reply within 24 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Contact" title="Have a project in mind?" subtitle="Tell me about it and I'll get back within 24 hours." />
        <Card className="mt-10 border-border/60 p-6 md:p-8"><ContactForm /></Card>
      </section>
    </SiteLayout>
  );
}