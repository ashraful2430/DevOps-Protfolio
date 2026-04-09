"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Sparkles,
  Layers3,
  Server,
  ShieldCheck,
  Workflow,
  Cloud,
  Terminal,
  Database,
} from "lucide-react";
import { experience } from "@/lib/data";

const floatingDots = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: 4 + (i % 4) * 2,
  left: `${(i * 9 + 11) % 100}%`,
  top: `${(i * 17 + 7) % 100}%`,
  duration: 5 + (i % 6),
  delay: i * 0.16,
}));

const toolkit = [
  { name: "AWS", icon: Cloud },
  { name: "Docker", icon: Layers3 },
  { name: "Kubernetes", icon: Server },
  { name: "Terraform", icon: Workflow },
  { name: "Linux", icon: Terminal },
  { name: "Prometheus", icon: ShieldCheck },
  { name: "Grafana", icon: Database },
  { name: "Nginx", icon: Server },
];

const focusAreas = [
  "Cloud infrastructure setup and management",
  "CI/CD pipeline design and automation",
  "Containerization and orchestration",
  "Monitoring, alerting, and observability",
  "Linux server operations and Nginx configuration",
  "Release stability and deployment reliability",
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.14] dark:opacity-[0.08]" />

        <motion.div
          animate={{
            x: [0, 42, 0],
            y: [0, -28, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-90px] top-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-500/12"
        />

        <motion.div
          animate={{
            x: [0, -46, 0],
            y: [0, 32, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-80px] top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10"
        />

        <motion.div
          animate={{
            x: [0, 24, 0],
            y: [0, 24, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/10"
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute -left-24 top-1/3 h-56 w-56 rounded-full border border-accent/15"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-24 bottom-8 h-64 w-64 rounded-full border border-cyan-400/15"
        />

        {floatingDots.map((dot) => (
          <motion.span
            key={dot.id}
            animate={{
              y: [0, -16, 0],
              x: [0, dot.id % 2 === 0 ? 8 : -8, 0],
              opacity: [0.15, 0.48, 0.15],
              scale: [1, 1.14, 1],
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
            Experience
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Professional
            <span className="bg-gradient-to-r from-accent via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              Journey
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            A modern overview of my hands-on DevOps engineering experience
            across cloud infrastructure, automation, deployment workflows, and
            reliability improvement.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-[32px] border border-border/80 bg-card/70 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              initial={{ width: "16%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute left-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ rotate: 6, scale: 1.04 }}
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                  >
                    <BriefcaseBusiness className="h-7 w-7" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                      {experience.role}
                    </h3>
                    <p className="mt-2 text-base font-medium text-accent">
                      {experience.company}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-accent" />
                        {experience.period}
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-accent" />
                        {experience.company}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  <Sparkles className="h-4 w-4" />
                  Live Experience
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-background/45 p-5 backdrop-blur-sm transition group-hover:border-accent/20">
                <p className="text-sm italic leading-8 text-muted-foreground md:text-base">
                  “{experience.quote}”
                </p>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Responsibilities & Contributions
                  </p>

                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent/70" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400/70" />
                    <span className="h-2 w-2 rounded-full bg-fuchsia-400/70" />
                  </div>
                </div>

                <div className="grid gap-4">
                  {experience.summary.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      whileHover={{ x: 4 }}
                      className="rounded-2xl border border-border bg-background/45 p-4 backdrop-blur-sm transition hover:border-accent/20"
                    >
                      <div className="flex gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <p className="text-sm leading-7 text-muted-foreground md:text-base">
                          {item}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.45 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[28px] border border-border/80 bg-card/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Core Impact
                  </p>

                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent/70" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400/70" />
                    <span className="h-2 w-2 rounded-full bg-fuchsia-400/70" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background/45 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Role
                    </p>
                    <p className="mt-2 text-lg font-bold text-foreground">
                      {experience.role}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/45 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Company
                    </p>
                    <p className="mt-2 text-lg font-bold text-foreground">
                      {experience.company}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/45 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Duration
                    </p>
                    <p className="mt-2 text-lg font-bold text-foreground">
                      {experience.period}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[28px] border border-border/80 bg-card/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    DevOps Toolkit
                  </p>

                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent/70" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400/70" />
                    <span className="h-2 w-2 rounded-full bg-fuchsia-400/70" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {toolkit.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.28, delay: index * 0.03 }}
                        whileHover={{ y: -3 }}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-background/45 p-3 transition group-hover:border-accent/10"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[28px] border border-border/80 bg-card/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Focus Areas
                  </p>

                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent/70" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400/70" />
                    <span className="h-2 w-2 rounded-full bg-fuchsia-400/70" />
                  </div>
                </div>

                <div className="space-y-3">
                  {focusAreas.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl border border-border bg-background/45 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <p className="text-sm leading-6 text-muted-foreground">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
