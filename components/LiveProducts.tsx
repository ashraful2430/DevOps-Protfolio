import { liveProducts } from "@/lib/data";
import { ExternalLink, Briefcase, CheckCircle2 } from "lucide-react";

export default function LiveProducts() {
  return (
    <section id="live-products" className="py-20 px-6 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Production Experience
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Live Products I Worked On
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
            Real platforms where I contributed as a DevOps Engineer through deployment,
            infrastructure support, release workflows, reliability improvement, and
            production operations.
          </p>
        </div>

        <div className="space-y-8">
          {liveProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur md:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
                      <Briefcase className="mr-2 h-4 w-4" />
                      {product.category}
                    </div>
                    <span className="rounded-full border border-border px-4 py-1 text-sm text-muted-foreground">
                      {product.role}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                    {product.name}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    {product.summary}
                  </p>

                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Visit Platform
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="w-full max-w-md rounded-2xl border border-border bg-background/60 p-5">
                  <h4 className="text-lg font-semibold text-white">Technologies</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <div>
                  <h4 className="text-lg font-semibold text-white">What I Did</h4>
                  <div className="mt-4 space-y-3">
                    {product.responsibilities.map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <p className="text-sm leading-7 text-muted-foreground md:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white">Impact / Achievements</h4>
                  <div className="mt-4 space-y-3">
                    {product.achievements.map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <p className="text-sm leading-7 text-muted-foreground md:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}