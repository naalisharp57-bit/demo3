import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

export default function Projects({ data }: { data: PortfolioData }) {
  const categories = ["All", ...Array.from(new Set(data.projects.map((p) => p.category)))];
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? data.projects
      : data.projects.filter((p) => p.category === active);

  return (
    <section id="work" className="border-t border-border bg-card">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-600 uppercase tracking-widest text-primary">
              Selected work
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Projects I'm proud of.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={
                  "h-9 rounded-full px-4 text-sm font-500 transition-colors " +
                  (active === c
                    ? "bg-foreground text-background"
                    : "border border-border bg-background hover:bg-muted")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {filtered.map((p, i) => (
            <a
              key={p.id}
              href={p.link}
              target={p.link.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={
                "group relative overflow-hidden rounded-2xl border border-border bg-background " +
                (i === 0 ? "sm:col-span-2" : "")
              }
            >
              <div className="overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className={
                    "w-full object-cover transition-transform duration-500 group-hover:scale-105 " +
                    (i === 0 ? "aspect-[16/9]" : "aspect-[4/3]")
                  }
                />
              </div>
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <span className="text-xs font-600 uppercase tracking-widest text-primary">
                    {p.category}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-600">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-colors group-hover:bg-foreground group-hover:text-background">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
