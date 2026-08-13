import type { PortfolioData } from "@/types/portfolio";

export default function Footer({ data }: { data: PortfolioData }) {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-bold">{data.name}</p>
          <p className="mt-1 text-sm text-secondary-foreground/70">
            {data.title} · {data.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {data.socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-secondary-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container py-4 text-xs text-secondary-foreground/60">
          © {new Date().getFullYear()} {data.name}. Built with OnSpace.
        </p>
      </div>
    </footer>
  );
}
