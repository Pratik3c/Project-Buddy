import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PricingCard, SectionHeading } from "./index";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Project Buddy" },
      { name: "description", content: "Assignment help, mini projects and full major projects with documentation, PPT and viva prep." },
      { property: "og:title", content: "Services — Project Buddy" },
      { property: "og:description", content: "Two clear pricing plans for academic project help." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Services" title="Two ways to work together" subtitle="Transparent starting prices. Final quote after we discuss your requirements." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <PricingCard
            title="Assignment / Mini Projects"
            price="₹99 to ₹999"
            suitableFor={["Weekly submissions", "Mini Projects", "Lab Assignments", "Small College Tasks"]}
            includes={["Source Code", "Explanation", "Documentation (if required)", "Setup Guide", "Basic Support"]}
          />
          <PricingCard
            popular
            title="Major Project"
            price="₹3999"
            suitableFor={["Final Year Project", "End-to-End Development", "Research Assistance", "Deployment"]}
            includes={["Documentation", "Presentation (PPT)", "Report", "Viva Preparation", "Google Meet", "Revision Support"]}
          />
        </div>
      </section>
    </SiteLayout>
  );
}
