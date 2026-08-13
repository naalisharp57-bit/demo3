import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-700">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-bold">Ava<span className="text-primary">.</span></span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Manage
          </Link>
          <a
            href="#contact"
            className="inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-600 text-background transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Hire me
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 md:hidden",
          open ? "max-h-80" : "max-h-0",
        )}
      >
        <ul className="container flex flex-col gap-1 py-4">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium hover:bg-muted"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-2 flex gap-3 px-3">
            <Link
              to="/login"
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-border text-sm font-600"
            >
              Manage
            </Link>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex h-11 flex-1 items-center justify-center rounded-full bg-foreground text-sm font-600 text-background"
            >
              Hire me
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
