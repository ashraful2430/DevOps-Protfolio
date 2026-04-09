"use client";

import { motion } from "framer-motion";
import { ExternalLink, FolderGit2, Server } from "lucide-react";
import { projects } from "@/lib/data";

const accentBars = [
  "from-emerald-500 via-cyan-500 to-sky-500",
  "from-cyan-500 via-sky-500 to-indigo-500",
  "from-fuchsia-500 via-pink-500 to-orange-400",
];

const floatingDots = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + (i % 4) * 2,
  left: `${(i * 13 + 7) % 100}%`,
  top: `${(i * 17 + 11) % 100}%`,
  duration: 5 + (i % 5),
  delay: i * 0.2,
}));

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.16] dark:opacity-[0.08]" />

        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-80px] top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-500/12"
        />

        <motion.div
          animate={{ x: [0, -45, 0], y: [0, 35, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-70px] top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10"
        />

        <motion.div
          animate={{ x: [0, 28, 0], y: [0, 25, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/10"
        />

        {floatingDots.map((dot) => (
          <motion.span
            key={dot.id}
            animate={{
              y: [0, -18, 0],
              x: [0, dot.id % 2 === 0 ? 8 : -8, 0],
              opacity: [0.15, 0.45, 0.15],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: dot.duration,
              delay: dot.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-accent/70 dark:bg-accent/55"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
            }}
          />
        ))}

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute -right-24 bottom-12 h-64 w-64 rounded-full border border-accent/15"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -left-24 top-1/3 h-56 w-56 rounded-full border border-cyan-400/15"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent shadow-[0_10px_30px_rgba(16,185,129,0.12)]">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Featured Projects
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Modern builds with
            <span className="bg-gradient-to-r from-accent via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              real product thinking
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            A curated showcase of full-stack products with strong UI, clean
            engineering patterns, and polished user experiences.
          </p>
        </motion.div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -12 }}
              className="group relative flex h-full overflow-hidden rounded-[30px] border border-border/80 bg-card/70 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                initial={{ width: "18%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={`absolute left-0 top-0 h-1.5 bg-gradient-to-r ${
                  accentBars[index % accentBars.length]
                }`}
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_32%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex min-h-full w-full flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <motion.div
                    whileHover={{ rotate: 6, scale: 1.04 }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                  >
                    <Server className="h-6 w-6" />
                  </motion.div>

                  <div className="flex shrink-0 items-center gap-2">
                    <motion.a
                      whileHover={{ y: -2, scale: 1.05 }}
                      href={project.clientUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition hover:border-accent/30 hover:text-accent"
                      title="Client Repository"
                    >
                      <FolderGit2 className="h-4 w-4" />
                    </motion.a>

                    <motion.a
                      whileHover={{ y: -2, scale: 1.05 }}
                      href={project.serverUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition hover:border-accent/30 hover:text-accent"
                      title="Server Repository"
                    >
                      <FolderGit2 className="h-4 w-4" />
                    </motion.a>

                    <motion.a
                      whileHover={{ y: -2, scale: 1.05 }}
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition hover:border-accent/30 hover:text-accent"
                      title="Live Project"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.a>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-7 text-accent">
                    {project.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tag, tagIndex) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: tagIndex * 0.03 }}
                      className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground transition group-hover:border-accent/20"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-5 flex flex-1">
                  <div className="w-full rounded-2xl border border-border bg-background/45 p-4 backdrop-blur-sm transition group-hover:border-accent/20">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Key Features
                      </p>

                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-accent/70" />
                        <span className="h-2 w-2 rounded-full bg-cyan-400/70" />
                        <span className="h-2 w-2 rounded-full bg-fuchsia-400/70" />
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {project.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="text-sm leading-7 text-muted-foreground"
                        >
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
