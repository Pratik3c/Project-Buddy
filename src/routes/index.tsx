import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  Code2,
  FileText,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  Presentation,
  Sparkles,
  Video,
  Wallet,
  Star,
  Lock,
} from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContactForm } from "@/components/site/contact-form";
import { Handwritten, CurvedArrow } from "@/components/site/handwritten";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const whyCards = [
  { icon: Wallet, title: "Affordable Pricing", desc: "Student-friendly rates that respect your budget." },
  { icon: HeartHandshake, title: "Personal Guidance", desc: "1:1 mentorship tailored to your project." },
  { icon: Video, title: "Google Meet Support", desc: "Face-to-face sessions when you need them." },
  { icon: FileText, title: "Project Documentation", desc: "Report, abstract, diagrams — done right." },
  { icon: Presentation, title: "Presentation Support", desc: "PPTs that actually explain your work." },
  { icon: Clock, title: "Fast Delivery", desc: "Deadlines matter. We move fast, without cutting corners." },
  { icon: GraduationCap, title: "Viva Preparation", desc: "Mock questions, answers, and confidence." },
  { icon: MessageCircle, title: "24x7 Chat Support", desc: "Coming soon — always-on help." },
];

const steps = [
  "Register",
  "Book Free Consultation",
  "Discuss Requirements",
  "Receive Quotation",
  "Payment",
  "Project Development",
  "Delivery",
  "Support & Explanation",
];

const faqs = [
  { q: "Who is Project Buddy for?", a: "Any college student who wants expert help with academic projects — from weekly assignments to final-year majors." },
  { q: "Do you write the code for me?", a: "We build it together. You get working code, documentation, and an explanation session so you can defend it in your viva." },
  { q: "What technologies do you support?", a: "Web (React, Node, Python), mobile, ML/AI, IoT, Java, C++, DBMS, and most college curriculum tech stacks." },
  { q: "How long does a project take?", a: "Mini projects: 3–7 days. Major projects: 2–6 weeks depending on scope. We agree on a timeline before starting." },
  { q: "Is my payment secure?", a: "You pay after we finalise the quotation. We use a manual UPI/QR flow with transaction ID verification." },
  { q: "Do you help with documentation and PPT?", a: "Yes — reports, abstracts, PPTs, viva prep and everything you need for submission." },
  { q: "Will you help me deploy the project?", a: "Absolutely. We help you deploy on Vercel, Render, Netlify or any platform your college requires." },
  { q: "What if I need changes after delivery?", a: "Revision support is included. We iterate until you're comfortable presenting it." },
  { q: "Can you help debug an existing project?", a: "Yes — book a consultation and share your repo. We debug, explain, and hand back a working project." },
  { q: "How do I book a consultation?", a: "Click 'Book Free Consultation', sign up, and submit your project details. We respond within 24 hours." },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-hero opacity-20" />
        <div aria-hidden className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
            <Badge variant="outline" className="mb-5 w-fit gap-1 rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-primary">
              <Sparkles className="h-3 w-3" /> Your Academic Project Partner
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-gradient">Project Buddy</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Helping college students successfully build academic projects with guidance, mentoring,
              documentation, presentations and technical support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="relative bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/auth/signup">
                  Book Free Consultation <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore Services</Link>
              </Button>
              <div className="pointer-events-none relative hidden items-center sm:flex">
                 <br />
                 <br />
                <Handwritten className="ml-1 -mt-4 text-xl">Start here!</Handwritten>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> 100+ projects</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> 4.9 avg rating</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
            <div className="glass shadow-glow relative rounded-3xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground">project-buddy.tsx</span>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-secondary/60 p-4 font-mono text-xs leading-relaxed text-foreground">
{`import { Mentor } from "project-buddy";

const yourFinalYearProject = new Mentor({
  guidance: "1:1",
  docs: true,
  ppt: true,
  viva: "prepared",
  deadline: "on-time",
});

await yourFinalYearProject.ship();
// → "A+ submission, viva confidence"`}
              </pre>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[Code2, FileText, Presentation].map((Icon, i) => (
                  <div key={i} className="glass flex items-center justify-center rounded-xl py-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Why choose me" title="Everything you need to ship a great project" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyCards.map((c) => (
            <Card key={c.title} className="group relative overflow-hidden border-border/60 p-5 transition hover:-translate-y-1 hover:shadow-card">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-primary p-2.5 text-primary-foreground shadow-glow">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
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

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="How it works" title="A clear path from idea to submission" />
        <div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 text-center">
          <CurvedArrow className="h-8 w-10 text-primary/60" flip />
          <Handwritten className="text-2xl">follow the flow</Handwritten>
        </div>
        <div className="relative mt-12">
          <div aria-hidden className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-primary via-primary/30 to-transparent md:left-1/2" />
          <ol className="space-y-8">
            {steps.map((label, i) => (
              <li key={label} className="relative md:grid md:grid-cols-2 md:items-center md:gap-8">
                <div className="absolute left-4 top-4 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground shadow-glow ring-4 ring-background">
                    {i + 1}
                  </div>
                </div>
                <div
                  className={
                    i % 2 === 0
                      ? "ml-12 md:ml-0 md:col-start-1 md:pr-10 md:text-right"
                      : "ml-12 md:ml-0 md:col-start-2 md:pl-10 md:text-left"
                  }
                >
                  <Card className="border-border/60 p-5">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Step {i + 1}</div>
                    <div className="mt-1 text-lg font-semibold">{label}</div>
                  </Card>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* REVIEWS TEASER */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Reviews" title="Trusted by students across India" />
        <Card className="mt-10 flex flex-col items-center gap-4 border-border/60 p-10 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Login to view verified student reviews.</p>
          <div className="flex gap-3">
            <Button asChild><Link to="/auth/login">Log in</Link></Button>
            <Button asChild variant="outline"><Link to="/auth/signup">Create account</Link></Button>
          </div>
        </Card>
      </section>

      {/* FAQ */}
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

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Contact" title="Have a project in mind?" subtitle="Tell me about it and I'll get back within 24 hours." />
        <div className="mx-auto mt-3 flex w-fit items-center gap-2">
          <Handwritten className="text-2xl">say hi</Handwritten>
          <CurvedArrow className="h-8 w-10 text-primary/60" />
        </div>
        <Card className="mt-10 border-border/60 p-6 md:p-8">
          <ContactForm />
        </Card>
        <div className="mx-auto mt-3 flex w-fit items-center gap-2">
          <Handwritten className="text-2xl">Keep checking Email Spam Folder...</Handwritten>
        </div>
      </section>
    </SiteLayout>
  );
}

export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium uppercase tracking-widest text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function PricingCard({
  title,
  price,
  suitableFor,
  includes,
  popular,
}: {
  title: string;
  price: string;
  suitableFor: string[];
  includes: string[];
  popular?: boolean;
}) {
  return (
    <Card className={`relative flex flex-col overflow-hidden border-border/60 p-8 ${popular ? "shadow-glow ring-1 ring-primary/40" : ""}`}>
      {popular && (
        <Badge className="absolute right-6 top-6 bg-gradient-primary text-primary-foreground">Most Popular</Badge>
      )}
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-xs text-muted-foreground">Starting at</span>
      </div>
      <div className="mt-1 text-4xl font-bold tracking-tight text-gradient">{price}</div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suitable for</div>
        <ul className="mt-3 space-y-2 text-sm">
          {suitableFor.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Includes</div>
        <ul className="mt-3 space-y-2 text-sm">
          {includes.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {s}
            </li>
          ))}
        </ul>
      </div>

      <Button asChild size="lg" className={`mt-8 ${popular ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""}`}>
        <Link to="/auth/signup">Book Consultation</Link>
      </Button>
    </Card>
  );
}
