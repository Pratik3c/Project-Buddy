import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import logoImg from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/reviews", label: "Reviews" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <img src={logoImg} alt="Project Buddy" className="h-9 w-9 shrink-0 object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]" />
          <span className="text-lg tracking-tight">Project Buddy</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {isAuthenticated ? (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to={isAdmin ? "/admin" : "/dashboard"}>
                <LayoutDashboard className="mr-1 h-4 w-4" />
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/auth/signup">Get started</Link>
              </Button>
            </>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                {isAuthenticated ? (
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <UserIcon className="h-4 w-4" /> {isAdmin ? "Admin" : "Dashboard"}
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">
                      Log in
                    </Link>
                    <Link to="/auth/signup" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}