import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

export default function Contact({ data }: { data: PortfolioData }) {
  const contactRows = [
    { icon: Mail, label: "Email", value: data.email, href: `mailto:${data.email}` },
    { icon: Phone, label: "Phone", value: data.phone, href: `tel:${data.phone}` },
    { icon: MapPin, label: "Location", value: data.location, href: undefined },
  ];

  return (
    <section id="contact" className="container py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-12 text-secondary-foreground md:px-12 md:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-600 uppercase tracking-widest text-accent">
              Let's work together
            </p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight sm:text-4xl">
              Have a project in mind? Let's make it real.
            </h2>
            <p className="mt-4 max-w-md text-secondary-foreground/80">
              Whether it's a logo, a website or a full brand, I'd love to hear about it.
              Send a message and I'll reply within 24 hours.
            </p>

            <a
              href={`mailto:${data.email}`}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-600 text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-3">
            {contactRows.map((row) => {
              const Row = row.href ? "a" : "div";
              return (
                <Row
                  key={row.label}
                  {...(row.href ? { href: row.href } : {})}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:bg-white/10"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <row.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-widest text-secondary-foreground/60">
                      {row.label}
                    </span>
                    <span className="block font-500">{row.value}</span>
                  </span>
                </Row>
              );
            })}
            <div className="flex flex-wrap gap-2 pt-2">
              {data.socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-500 transition-colors hover:border-accent hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
