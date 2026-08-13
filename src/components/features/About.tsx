import type { PortfolioData } from "@/types/portfolio";

export default function About({ data }: { data: PortfolioData }) {
  return (
    <section id="about" className="border-y border-border bg-card">
      <div className="container grid gap-10 py-16 md:grid-cols-[1fr_1.2fr] md:py-24">
        <div>
          <p className="text-sm font-600 uppercase tracking-widest text-primary">
            About me
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A student's fresh eye, a professional's polish.
          </h2>
        </div>
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-muted-foreground">{data.bio}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-500"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
