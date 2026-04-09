"use client";

import { motion } from "framer-motion";
import { ExternalLink, FolderGit2, Server } from "lucide-react";
import { projects } from "@/lib/data";

const accentBars = [
  "from-emerald-500 to-cyan-500",
  "from-cyan-500 to-sky-500",
  "from-fuchsia-500 to-orange-400",
];

export default function Projects() {
  return (
    <>
      <section id="projects" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Projects
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Featured Work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Real projects built with modern frontend engineering, scalable
              application structure, and production-focused thinking.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[28px] border border-border bg-card/70 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              >
                <motion.div
                  initial={{ width: "18%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`h-1.5 bg-gradient-to-r ${accentBars[index % accentBars.length]}`}
                />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Server className="h-6 w-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.clientUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition hover:border-accent/30 hover:text-accent"
                        title="Client Repository"
                      >
                        <FolderGit2 className="h-4 w-4" />
                      </a>

                      <a
                        href={project.serverUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition hover:border-accent/30 hover:text-accent"
                        title="Server Repository"
                      >
                        <FolderGit2 className="h-4 w-4" />
                      </a>

                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition hover:border-accent/30 hover:text-accent"
                        title="Live Project"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-foreground">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-accent">
                    {project.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-border bg-background/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Key Features
                    </p>

                    <ul className="mt-3 space-y-2">
                      {project.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="text-sm leading-6 text-muted-foreground"
                        >
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
