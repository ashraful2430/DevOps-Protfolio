"use client";

import { useState } from "react";
import { liveProducts } from "@/lib/data";
import { ExternalLink, Briefcase, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

type TiltState = {
  rotateX: number;
  rotateY: number;
  x: number;
  y: number;
};

function ProductCard({
  product,
  index,
}: {
  product: (typeof liveProducts)[number];
  index: number;
}) {
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    x: 50,
    y: 50,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;

    setTilt({
      rotateX,
      rotateY,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      x: 50,
      y: 50,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
      className="relative [perspective:1400px]"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
        style={{ transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-3xl border border-border bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-500 hover:border-accent/40 sm:p-6 md:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${tilt.x}% ${tilt.y}%, rgba(29,158,117,0.18), transparent 28%), radial-gradient(circle at ${tilt.x}% ${tilt.y}%, rgba(34,211,238,0.12), transparent 40%)`,
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.06] dark:opacity-[0.08]" />

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition duration-500 group-hover:bg-accent/15" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-500/15" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl" style={{ transform: "translateZ(40px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + index * 0.05, duration: 0.45 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
                <Briefcase className="mr-2 h-4 w-4" />
                {product.category}
              </div>

              <span className="rounded-full border border-border bg-background/70 px-4 py-1 text-sm text-muted-foreground">
                {product.role}
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + index * 0.05, duration: 0.45 }}
              className="mt-4 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl"
            >
              {product.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 + index * 0.05, duration: 0.45 }}
              className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base"
            >
              {product.summary}
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.45 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 sm:w-auto"
            >
              Visit Platform
              <ExternalLink className="h-4 w-4" />
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22 + index * 0.05, duration: 0.5 }}
            className="w-full max-w-md rounded-2xl border border-border bg-background/70 p-5 shadow-inner"
            style={{ transform: "translateZ(30px)" }}
          >
            <h4 className="text-lg font-semibold text-foreground">Technologies</h4>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.technologies.map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: 0.03 * techIndex,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -2, scale: 1.03 }}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <div
          className="relative z-10 mt-8 grid gap-8 lg:grid-cols-2"
          style={{ transform: "translateZ(20px)" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + index * 0.05, duration: 0.55 }}
          >
            <h4 className="text-lg font-semibold text-foreground">What I Did</h4>

            <div className="mt-4 space-y-3">
              {product.responsibilities.map((item, itemIndex) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.04 * itemIndex,
                    ease: "easeOut",
                  }}
                  className="flex gap-3"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28 + index * 0.05, duration: 0.55 }}
          >
            <h4 className="text-lg font-semibold text-foreground">
              Impact / Achievements
            </h4>

            <div className="mt-4 space-y-3">
              {product.achievements.map((item, itemIndex) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.04 * itemIndex,
                    ease: "easeOut",
                  }}
                  className="flex gap-3"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 text-xs font-semibold tracking-[0.3em] text-muted-foreground/50">
          0{index + 1}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LiveProducts() {
  return (
    <section
      id="live-products"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] top-[14%] h-52 w-52 rounded-full bg-accent/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 22, 0], x: [0, -18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-[20%] h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[8%] left-[18%] h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:54px_54px] opacity-[0.04] dark:opacity-[0.06]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Production Experience
          </p>

          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl lg:text-5xl">
            Live Products I Worked On
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg">
            Real platforms where I contributed as a DevOps Engineer through
            deployment, infrastructure support, release workflows, reliability
            improvement, and production operations.
          </p>
        </motion.div>

        <div className="space-y-8">
          {liveProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}