import { PenTool, Layout, Sparkles } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

const icons = [PenTool, Layout, Sparkles];

export default function Services({ data }: { data: PortfolioData }) {
  return (
    <section id="services" className="container py-16 md:py-24">
      <div className="max-w-xl">
        <p className="text-sm font-600 uppercase tracking-widest text-primary">
          What I offer
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Services built for growing brands.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {data.services.map((service, i) => {
          const Icon = icons[i % icons.length];
          const featured = i === 0;
          return (
            <article
              key={service.id}
              className={
                "group rounded-2xl border p-6 transition-transform hover:-translate-y-1 " +
                (featured
                  ? "border-transparent bg-secondary text-secondary-foreground shadow-soft md:row-span-1"
                  : "border-border bg-card")
              }
            >
              <span
                className={
                  "grid h-12 w-12 place-items-center rounded-xl " +
                  (featured ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary")
                }
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-600">{service.title}</h3>
              <p
                className={
                  "mt-2 text-sm leading-relaxed " +
                  (featured ? "text-secondary-foreground/80" : "text-muted-foreground")
                }
              >
                {service.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
