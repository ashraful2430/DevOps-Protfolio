"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Goal,
  Layers3,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { projects } from "@/lib/data";
import Section3DAccent from "@/components/Section3DAccent";

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
  const [featuredProject, ...supportingProjects] = projects;

  return (
    <section id="projects" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Section3DAccent align="right" label="APP" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.16] dark:opacity-[0.08]" />

        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-80px] top-20 h-72 w-72 rounded-full bg-emerald-500/16 blur-3xl dark:bg-emerald-500/10"
        />
        <motion.div
          animate={{ x: [0, -45, 0], y: [0, 35, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-70px] top-24 h-80 w-80 rounded-full bg-cyan-400/16 blur-3xl dark:bg-cyan-400/10"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute -right-24 bottom-12 h-64 w-64 rounded-full border border-accent/15"
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
            Recent project with
            <span className="bg-gradient-to-r from-accent via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              product-grade execution
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            A focused case study for the latest product I shipped, followed by
            earlier full-stack builds that show range across UI, backend, and
            deployment work.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.55 }}
          className="group relative mt-12 overflow-hidden rounded-[32px] border border-accent/20 bg-card/75 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent via-emerald-400 to-cyan-400" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_30%)]" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-accent/20" />
          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full border border-cyan-400/20" />

          <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_0.85fr] lg:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  <Sparkles className="h-4 w-4" />
                  {featuredProject.category}
                </span>
                <span className="rounded-full border border-border bg-background/55 px-4 py-2 text-xs font-semibold text-muted-foreground">
                  Live on Netlify
                </span>
              </div>

              <h3 className="mt-6 text-3xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {featuredProject.title}
              </h3>
              <p className="mt-3 text-base font-semibold leading-7 text-accent sm:text-lg">
                {featuredProject.subtitle}
              </p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                {featuredProject.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Goal, label: "Goal System", value: "Daily clarity" },
                  { icon: Activity, label: "Fitness", value: "Routine tracking" },
                  { icon: BarChart3, label: "Reports", value: "Progress view" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-border bg-background/50 p-4"
                  >
                    <item.icon className="h-5 w-5 text-accent" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/45 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Product Thinking
                  </p>
                  <div className="mt-4 space-y-3">
                    {featuredProject.productFocus?.map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <p className="text-sm leading-7 text-muted-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/45 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Key Features
                  </p>
                  <div className="mt-4 space-y-3">
                    {featuredProject.features.map((feature) => (
                      <div key={feature} className="flex gap-3">
                        <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <p className="text-sm leading-7 text-muted-foreground">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <motion.a
                  whileHover={{ y: -2, scale: 1.02 }}
                  href={featuredProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_36px_rgba(16,185,129,0.24)] transition"
                >
                  View Live Project
                  <ExternalLink className="h-4 w-4" />
                </motion.a>

                <div className="flex flex-wrap gap-2">
                  {featuredProject.technologies.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-border bg-background/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),transparent_42%),linear-gradient(315deg,rgba(34,211,238,0.12),transparent_38%)]" />
              <motion.div
                animate={{ y: [0, -10, 0], rotateX: [0, 3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto max-w-md rounded-[26px] border border-border bg-card/90 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Today Dashboard
                    </p>
                    <p className="mt-1 text-xl font-black text-foreground">
                      Personal OS
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Layers3 className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Fitness", "74%", "bg-emerald-400"],
                    ["Learning", "3.5h", "bg-cyan-400"],
                    ["Money", "$240", "bg-fuchsia-400"],
                    ["Focus", "5 blocks", "bg-sky-400"],
                  ].map(([label, value, color]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-border bg-background/70 p-4"
                    >
                      <span className={`block h-2 w-10 rounded-full ${color}`} />
                      <p className="mt-4 text-xs text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-1 text-xl font-black text-foreground">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">
                      Weekly Progress
                    </p>
                    <span className="text-xs font-semibold text-accent">
                      +18%
                    </span>
                  </div>
                  <div className="mt-4 flex h-24 items-end gap-2">
                    {[38, 56, 44, 72, 64, 82, 92].map((height, index) => (
                      <motion.span
                        key={height}
                        initial={{ height: 12 }}
                        whileInView={{ height }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.06 }}
                        className="flex-1 rounded-t-xl bg-gradient-to-t from-accent to-cyan-400"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Impact
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {featuredProject.impact}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Earlier Builds
              </p>
              <h3 className="mt-2 text-2xl font-bold text-foreground">
                Supporting full-stack work
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              These projects are kept compact so the recent case study stays the
              main story while still showing breadth.
            </p>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {supportingProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -10 }}
                className="group relative flex h-full overflow-hidden rounded-[28px] border border-border/80 bg-card/70 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
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

                <div className="relative flex min-h-full w-full flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <motion.div
                      whileHover={{ rotate: 6, scale: 1.04 }}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                    >
                      <Server className="h-6 w-6" />
                    </motion.div>

                    <div className="flex shrink-0 items-center gap-2">
                      {project.clientUrl && (
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
                      )}

                      {project.serverUrl && (
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
                      )}

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
                    <h4 className="text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent">
                      {project.title}
                    </h4>
                    <p className="mt-2 text-sm font-medium leading-7 text-accent">
                      {project.subtitle}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground transition group-hover:border-accent/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-1">
                    <div className="w-full rounded-2xl border border-border bg-background/45 p-4 backdrop-blur-sm transition group-hover:border-accent/20">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Key Features
                      </p>
                      <ul className="space-y-2">
                        {project.features.slice(0, 3).map((feature) => (
                          <li
                            key={feature}
                            className="flex gap-2 text-sm leading-7 text-muted-foreground"
                          >
                            <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-accent" />
                            <span>{feature}</span>
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
      </div>
    </section>
  );
}
