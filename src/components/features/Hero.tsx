import { ArrowUpRight, MapPin } from "lucide-react";
import heroImg from "@/assets/hero.png";
import type { PortfolioData } from "@/types/portfolio";

export default function Hero({ data }: { data: PortfolioData }) {
  return (
    <section id="top" className="relative overflow-hidden grain">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />

      <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="animate-fade-up">
          {data.available && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-600 shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Available for freelance work
            </span>
          )}

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {data.name.split(" ")[0]}{" "}
            <span className="text-primary">{data.name.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="mt-3 font-display text-lg font-500 text-secondary">
            {data.title}
          </p>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground text-balance">
            {data.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-600 text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              View my work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 font-600 transition-colors hover:bg-muted"
            >
              Get in touch
            </a>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {data.location}
          </p>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="absolute -left-4 top-6 hidden rotate-[-6deg] rounded-2xl border border-border bg-card px-4 py-3 shadow-soft md:block">
            <p className="font-display text-2xl font-bold text-primary">
              {data.projects.length}+
            </p>
            <p className="text-xs text-muted-foreground">Projects shipped</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <img
              src={heroImg}
              alt="Creative portfolio artwork by the designer"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 right-4 hidden rotate-[4deg] rounded-2xl border border-border bg-secondary px-4 py-3 text-secondary-foreground shadow-soft md:block">
            <p className="font-display text-sm font-600">Open to briefs ✦</p>
            <p className="text-xs text-secondary-foreground/70">Reply within 24h</p>
          </div>
        </div>
      </div>
    </section>
  );
}
