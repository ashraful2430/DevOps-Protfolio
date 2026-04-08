"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { devopsSkills, mernSkills } from "@/lib/data";
import SkillPanel from "@/components/skills/SkillPanel";

type TabKey = "devops" | "mern";

export type SkillKey =
  | "cicd"
  | "docker"
  | "k8s"
  | "terraform"
  | "ansible"
  | "aws"
  | "prometheus"
  | "git"
  | "linux"
  | "nginx";

type SkillItem = {
  key: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  short: string;
  proficiency: number;
};

const interactiveMap: Record<string, SkillKey | null> = {
  docker: "docker",
  kubernetes: "k8s",
  terraform: "terraform",
  ansible: "ansible",
  aws: "aws",
  prometheus: "prometheus",
  nginx: "nginx",
  linux: "linux",
  git: "git",
  gitlab: "cicd",
  "github-actions": "cicd",
  jenkins: "cicd",
  argocd: "cicd",
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "devops", label: "DevOps" },
  { key: "mern", label: "MERN" },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + (i % 4) * 3,
  left: `${(i * 7 + 9) % 100}%`,
  top: `${(i * 11 + 13) % 100}%`,
  duration: 6 + (i % 5),
  delay: (i % 6) * 0.5,
}));

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.22] dark:opacity-[0.12]" />

      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -25, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-500/15"
      />

      <motion.div
        animate={{
          x: [0, -35, 0],
          y: [0, 25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-40px] top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10"
      />

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-teal-400/15 blur-3xl dark:bg-teal-400/10"
      />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: [0.15, 0.5, 0.15],
            y: [0, -18, 0],
            x: [0, particle.id % 2 === 0 ? 8 : -8, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-accent/70 dark:bg-accent/55"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
          }}
        />
      ))}
    </div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabKey>("devops");
  const [activeSkill, setActiveSkill] = useState<SkillKey>("cicd");

  const filteredSkills: SkillItem[] = useMemo(
    () => (activeTab === "devops" ? devopsSkills : mernSkills),
    [activeTab]
  );

  const firstInteractive = useMemo(() => {
    const found = filteredSkills.find((s) => interactiveMap[s.key]);
    return (found ? interactiveMap[found.key] : "cicd") || "cicd";
  }, [filteredSkills]);

  const interactiveSkills = filteredSkills.filter((item) => interactiveMap[item.key]);

  useEffect(() => {
    setActiveSkill(firstInteractive);
  }, [firstInteractive]);

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <AnimatedBackground />

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
            Interactive Skills
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Skills that feel
            <span className="bg-gradient-to-r from-accent via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              alive
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Explore the technologies I use in real development and DevOps workflows.
            Each interactive card highlights skill level and opens a live concept panel.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-accent to-emerald-500 text-white shadow-[0_14px_36px_rgba(16,185,129,0.28)]"
                    : "border border-border bg-card/70 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-full bg-white/10" />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredSkills.map((skill, index) => {
            const interactive = interactiveMap[skill.key];
            const isActive = interactive && activeSkill === interactive;
            const Icon = skill.icon;

            return (
              <motion.button
                key={skill.key}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                whileHover={{
                  y: -8,
                  rotateX: 4,
                  rotateY: index % 2 === 0 ? 3 : -3,
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => interactive && setActiveSkill(interactive)}
                className={`group relative overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 sm:p-5 ${
                  isActive
                    ? "border-accent/40 bg-gradient-to-br from-accent/14 via-card to-cyan-400/10 shadow-[0_22px_55px_rgba(16,185,129,0.18)]"
                    : "border-border/80 bg-card/70 hover:border-accent/25 hover:shadow-[0_18px_45px_rgba(16,185,129,0.08)]"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-0" />

                <motion.div
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 3 + (index % 4),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex items-start justify-between gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-background/75 text-foreground shadow-sm backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      skill.proficiency >= 90
                        ? "bg-accent/15 text-accent"
                        : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                    }`}
                  >
                    {skill.proficiency}%
                  </div>
                </motion.div>

                <div className="relative mt-4">
                  <h3 className="text-sm font-bold text-foreground sm:text-base">
                    {skill.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                    {skill.short}
                  </p>
                </div>

                <div className="relative mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-border/70">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.85, delay: 0.06 + index * 0.02 }}
                      className="h-full rounded-full bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
                    />
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {interactive ? "Interactive" : "Overview"}
                  </span>
                  {interactive && (
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-[11px] font-semibold text-accent"
                    >
                      Click to open
                    </motion.span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {activeTab === "devops" && interactiveSkills.length > 0 && (
          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.985 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <SkillPanel skill={activeSkill} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}