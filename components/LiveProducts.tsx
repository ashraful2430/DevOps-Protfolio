"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Server,
  Sparkles,
} from "lucide-react";
import { liveProducts } from "@/lib/data";

const floatingDots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 4 + (i % 4) * 2,
  left: `${(i * 11 + 9) % 100}%`,
  top: `${(i * 19 + 13) % 100}%`,
  duration: 5 + (i % 5),
  delay: i * 0.18,
}));

const cardAccents = [
  "from-emerald-500 via-cyan-500 to-sky-500",
  "from-cyan-500 via-sky-500 to-indigo-500",
  "from-fuchsia-500 via-pink-500 to-orange-400",
];

export default function LiveProducts() {
  return (
    <section
      id="live-products"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.14] dark:opacity-[0.08]" />

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-80px] top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-500/12"
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 35, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-70px] top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10"
        />

        <motion.div
          animate={{
            x: [0, 26, 0],
            y: [0, 28, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/10"
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute -right-24 top-1/3 h-64 w-64 rounded-full border border-accent/15"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute -left-24 bottom-10 h-56 w-56 rounded-full border border-cyan-400/15"
        />

        {floatingDots.map((dot) => (
          <motion.span
            key={dot.id}
            animate={{
              y: [0, -16, 0],
              x: [0, dot.id % 2 === 0 ? 8 : -8, 0],
              opacity: [0.15, 0.5, 0.15],
              scale: [1, 1.12, 1],
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
            Production Experience
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Live Products
            <span className="bg-gradient-to-r from-accent via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              I Worked On
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Real production platforms where I contributed to deployment,
            infrastructure support, release workflows, reliability improvement,
            and day-to-day DevOps operations.
          </p>
        </motion.div>

        <div className="mt-12 space-y-8">
          {liveProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[32px] border border-border/80 bg-card/70 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                initial={{ width: "16%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={`absolute left-0 top-0 h-1.5 bg-gradient-to-r ${
                  cardAccents[index % cardAccents.length]
                }`}
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative p-6 md:p-8">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 6, scale: 1.04 }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                      >
                        <Briefcase className="h-6 w-6" />
                      </motion.div>

                      <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                        {product.category}
                      </div>

                      <span className="rounded-full border border-border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground">
                        {product.role}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-bold text-foreground md:text-3xl">
                      {product.name}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                      {product.summary}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <motion.a
                        whileHover={{ y: -2, scale: 1.02 }}
                        href={product.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_36px_rgba(16,185,129,0.22)] transition"
                      >
                        Visit Platform
                        <ExternalLink className="h-4 w-4" />
                      </motion.a>

                      <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4 text-accent" />
                        Live Production
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="rounded-2xl border border-border/70 bg-background/55 p-4"
                    >
                      <div className="flex items-center gap-2 text-accent">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Focus
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-bold text-foreground">
                        DevOps
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Deployment & reliability
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -3 }}
                      className="rounded-2xl border border-border/70 bg-background/55 p-4"
                    >
                      <div className="flex items-center gap-2 text-accent">
                        <Server className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Environment
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-bold text-foreground">
                        Production
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Live operational stack
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -3 }}
                      className="rounded-2xl border border-border/70 bg-background/55 p-4"
                    >
                      <div className="flex items-center gap-2 text-accent">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Impact
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-bold text-foreground">
                        Active
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Release & infra support
                      </p>
                    </motion.div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-border bg-background/45 p-5 backdrop-blur-sm transition group-hover:border-accent/20"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        What I Did
                      </p>
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-accent/70" />
                        <span className="h-2 w-2 rounded-full bg-cyan-400/70" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {product.responsibilities.map((item) => (
                        <div key={item} className="flex gap-3">
                          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                          <p className="text-sm leading-7 text-muted-foreground">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-border bg-background/45 p-5 backdrop-blur-sm transition group-hover:border-accent/20"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Achievements
                      </p>
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-accent/70" />
                        <span className="h-2 w-2 rounded-full bg-fuchsia-400/70" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {product.achievements.map((item) => (
                        <div key={item} className="flex gap-3">
                          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                          <p className="text-sm leading-7 text-muted-foreground">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-border bg-background/45 p-5 backdrop-blur-sm transition group-hover:border-accent/20"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Technologies
                      </p>
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-accent/70" />
                        <span className="h-2 w-2 rounded-full bg-cyan-400/70" />
                        <span className="h-2 w-2 rounded-full bg-fuchsia-400/70" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.28,
                            delay: techIndex * 0.03,
                          }}
                          className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition group-hover:border-accent/20"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
