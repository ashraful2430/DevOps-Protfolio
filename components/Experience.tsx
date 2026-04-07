import { experience } from "@/lib/data";
import { BriefcaseBusiness, CalendarDays } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Career Journey
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Professional Experience
          </h2>
        </div>

        <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
                <BriefcaseBusiness className="h-4 w-4" />
                {experience.role}
              </div>

              <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                {experience.company}
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {experience.period}
            </div>
          </div>

          <blockquote className="mt-8 border-l-4 border-accent pl-5 text-lg italic leading-8 text-slate-300">
            "{experience.quote}"
          </blockquote>

          <div className="mt-8 space-y-5">
            {experience.summary.map((item) => (
              <p
                key={item}
                className="text-sm leading-8 text-muted-foreground md:text-base"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}