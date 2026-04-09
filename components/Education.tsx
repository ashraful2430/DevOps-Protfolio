"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  School,
  CalendarDays,
  MapPin,
  Sparkles,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

const educationItems = [
  {
    id: 1,
    title: "Chittagong Polytechnic Institute",
    subtitle: "Diploma in Engineering",
    period: "2020 - 2024",
    location: "Chattogram, Bangladesh",
    description:
      "Built a strong foundation in technical education, structured problem-solving, and computing concepts. This stage played an important role in shaping my journey toward software engineering and DevOps.",
    icon: GraduationCap,
    glow: "bg-emerald-400/15",
    iconStyle: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20",
  },
  {
    id: 2,
    title: "Bangladesh Railway High School",
    subtitle: "Secondary School",
    period: "2017 - 2019",
    location: "Bangladesh",
    description:
      "Completed my secondary education with a growing passion for technology, discipline, and analytical thinking. This period helped build the mindset that later guided me into engineering and development.",
    icon: School,
    glow: "bg-cyan-400/15",
    iconStyle: "bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20",
  },
];

function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: 6 + (i % 4) * 6,
        left: `${5 + i * 6.5}%`,
        duration: 8 + (i % 5),
        delay: i * 0.4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-foreground/10 blur-[1px]"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            bottom: "-30px",
          }}
          animate={{
            y: [-10, -250],
            x: [0, particle.id % 2 === 0 ? 18 : -18, 0],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.15, 0.7],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120,120,120,0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120,120,120,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0px 0px", "42px 42px"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(16,185,129,0.12), transparent 55%)",
          backgroundSize: "500px 500px",
        }}
      />
    </div>
  );
}

export default function Education() {
  return (
    <section
      id="education"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      <AnimatedGrid />
      <FloatingParticles />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-[8%] top-[10%] h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl"
          animate={{
            y: [0, -18, 0],
            x: [0, 12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-[14%] h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl"
          animate={{
            y: [0, 22, 0],
            x: [0, -16, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[8%] left-[22%] h-40 w-40 rounded-full bg-violet-500/15 blur-3xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 18, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Academic Background
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Education
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            My academic journey shaped the technical mindset, learning
            discipline, and problem-solving approach that continue to support my
            work in software engineering and DevOps.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {educationItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -40 : 40,
                  y: 30,
                  rotateY: index % 2 === 0 ? -10 : 10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotateY: 0,
                }}
                transition={{ duration: 0.8, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8, scale: 1.01 }}
                style={{ transformStyle: "preserve-3d" }}
                className="group relative overflow-hidden rounded-[30px] border border-border bg-card/70 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-transparent dark:from-white/[0.05]" />

                <motion.div
                  className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${item.glow} blur-3xl`}
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 25, 0] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-foreground/5 blur-3xl"
                  animate={{ scale: [1, 1.12, 1], rotate: [0, -25, 0] }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.iconStyle}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Institution
                        </p>
                        <p className="text-base font-medium text-foreground">
                          {item.title}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                      Education
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground">
                    {item.subtitle}
                  </h3>

                  <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{item.period}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">
                    {item.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Focus</p>
                        <p className="text-sm font-medium text-foreground">
                          Learning • Growth • Foundation
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
