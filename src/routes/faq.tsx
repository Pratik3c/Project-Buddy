import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { SectionHeading } from "./index";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Who is Project Buddy for?", a: "Any college student who wants expert help with academic projects — from weekly assignments to final-year majors." },
  { q: "Do you write the code for me?", a: "We build it together. You get working code, documentation, and an explanation session so you can defend it in your viva." },
  { q: "What technologies do you support?", a: "Web (React, Node, Python), mobile, ML/AI, IoT, Java, C++, DBMS, and most college curriculum tech stacks." },
  { q: "How long does a project take?", a: "Mini projects: 3–7 days. Major projects: 2–6 weeks depending on scope." },
  { q: "Is my payment secure?", a: "You pay after we finalise the quotation. We use a manual UPI/QR flow with transaction ID verification." },
  { q: "Do you help with documentation and PPT?", a: "Yes — reports, abstracts, PPTs, viva prep and everything you need for submission." },
  { q: "Will you help me deploy the project?", a: "Absolutely. We help you deploy on Vercel, Render, Netlify or any platform." },
  { q: "What if I need changes after delivery?", a: "Revision support is included. We iterate until you're comfortable presenting it." },
  { q: "Can you help debug an existing project?", a: "Yes — book a consultation and share your repo." },
  { q: "How do I book a consultation?", a: "Click Sign up, then submit your project details. We respond within 24 hours." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Project Buddy" },
      { name: "description", content: "Answers to common questions about Project Buddy services, pricing and delivery." },
      { property: "og:title", content: "FAQ — Project Buddy" },
      { property: "og:description", content: "Everything you need to know before booking a consultation." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="border-border/60">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}