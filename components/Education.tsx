"use client";

import { motion } from "framer-motion";
import { GraduationCap, School, CalendarDays, MapPin } from "lucide-react";

const educationItems = [
  {
    id: 1,
    title: "Chittagong Polytechnic Institute",
    subtitle: "Diploma in Engineering",
    period: "2020 - 2024",
    location: "Chattogram, Bangladesh",
    description:
      "Focused on technical education, problem-solving, and practical computing knowledge. Built a strong academic foundation that supports my software engineering and DevOps journey.",
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "Bangladesh Railway High School",
    subtitle: "Secondary School",
    period: "2017 - 2019",
    location: "Bangladesh",
    description:
      "Completed secondary education with a strong interest in technology, analytical thinking, and structured learning, which later shaped my path toward engineering and development.",
    icon: School,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Education() {
  return (
    <section
      id="education"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[240px] w-[240px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md">
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            Academic Background
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Education
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
            My academic journey built the discipline, technical mindset, and
            structured problem-solving approach that continue to shape my work
            in software engineering and DevOps.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {educationItems.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl transition-all duration-300 group-hover:bg-emerald-400/20" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                      Education
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-base font-medium text-emerald-400">
                    {item.subtitle}
                  </p>

                  <div className="mt-5 flex flex-col gap-3 text-sm text-white/65 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-white/45" />
                      <span>{item.period}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-white/45" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-white/70 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
