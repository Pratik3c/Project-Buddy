import { Link } from "@tanstack/react-router";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 font-bold">
            <img src={logoImg} alt="Project Buddy" className="h-9 w-9 object-contain" />
            <span className="text-lg">Project Buddy</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Your academic project partner — guidance, mentoring, documentation, presentations and
            technical support for college students.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {/* <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              <Instagram className="h-4 w-4" />
            </a> */}
            <a href="mailto:learnandcraft09@gmail.com" aria-label="Email" className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/how-it-works" className="hover:text-foreground">How it works</Link></li>
            <li><Link to="/reviews" className="hover:text-foreground">Reviews</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth/signup" className="hover:text-foreground">Sign up</Link></li>
            <li><Link to="/auth/login" className="hover:text-foreground">Log in</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Project Buddy. All rights reserved.</p>
          <p>Built for students, by a developer who's been there.</p>
        </div>
      </div>
    </footer>
  );
}