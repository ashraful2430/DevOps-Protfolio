"use client";

import { useMemo, useRef, useState } from "react";
import {
  Activity,
  Bot,
  Boxes,
  Cloud,
  GitBranch,
  Globe,
  Rocket,
  TerminalSquare,
  Wrench,
  Box,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import SkillPanel from "@/components/skills/SkillPanel";

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

type TabKey = "DevOps" | "MERN";

type Skill = {
  key: SkillKey;
  name: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  proficiency: number;
};

const devopsSkills: Skill[] = [
  { key: "cicd", name: "CI/CD", short: "Pipeline automation", icon: Rocket, proficiency: 92 },
  { key: "docker", name: "Docker", short: "Containerization", icon: Box, proficiency: 90 },
  { key: "k8s", name: "Kubernetes", short: "Orchestration", icon: Boxes, proficiency: 86 },
  { key: "terraform", name: "Terraform", short: "Infrastructure as Code", icon: Wrench, proficiency: 84 },
  { key: "ansible", name: "Ansible", short: "Configuration automation", icon: Bot, proficiency: 80 },
  { key: "aws", name: "AWS", short: "Cloud infrastructure", icon: Cloud, proficiency: 88 },
  { key: "prometheus", name: "Prometheus", short: "Monitoring & alerts", icon: Activity, proficiency: 82 },
  { key: "git", name: "Git Flow", short: "Version control workflow", icon: GitBranch, proficiency: 87 },
  { key: "linux", name: "Linux", short: "Server operations", icon: TerminalSquare, proficiency: 90 },
  { key: "nginx", name: "Nginx", short: "Reverse proxy & delivery", icon: Globe, proficiency: 84 },
];

const mernSkills = [
  { name: "React", proficiency: 90 },
  { name: "Next.js", proficiency: 85 },
  { name: "Node.js", proficiency: 83 },
  { name: "Express", proficiency: 80 },
  { name: "MongoDB", proficiency: 78 },
  { name: "Tailwind", proficiency: 92 },
];

function ProficiencyBar({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-md"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs font-medium text-muted-foreground">{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${value}%` : 0 }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabKey>("DevOps");
  const [activeSkill, setActiveSkill] = useState<SkillKey>("cicd");

  const activeSkillMeta = useMemo(
    () => devopsSkills.find((skill) => skill.key === activeSkill)!,
    [activeSkill]
  );

  return (
    <section id="skills" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] top-[14%] h-44 w-44 rounded-full bg-accent/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[18%] h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.04] dark:opacity-[0.07]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            Interactive Skills
          </p>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl lg:text-5xl">
            My Skills — click to see how it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg">
            Each DevOps skill opens a live interactive panel showing the concept in action.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {(["DevOps", "MERN"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "border border-border bg-card/80 text-muted-foreground backdrop-blur-md hover:border-accent hover:text-accent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "DevOps" ? (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {devopsSkills.map((skill, index) => {
                const Icon = skill.icon;
                const isActive = activeSkill === skill.key;

                return (
                  <motion.button
                    key={skill.key}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSkill(skill.key)}
                    className={`group relative overflow-hidden rounded-2xl border p-4 text-left shadow-md backdrop-blur-md transition ${
                      isActive
                        ? "border-accent/50 bg-gradient-to-br from-accent/10 via-card/95 to-cyan-400/10 shadow-[0_10px_40px_rgba(29,158,117,0.12)]"
                        : "border-border bg-card/75 hover:border-accent/30"
                    }`}
                  >
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-accent/[0.04]" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                          isActive
                            ? "border-white/10 bg-gradient-to-br from-accent to-emerald-400 text-white shadow-lg shadow-accent/20"
                            : "border-border bg-background/80 text-accent"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-foreground sm:text-base">
                          {skill.name}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {skill.short}
                        </p>
                      </div>

                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 + index * 0.03 }}
                          className="h-full rounded-full bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkill}
                  initial={{ opacity: 0, x: 30, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -30, y: 10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <SkillPanel skill={activeSkill} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {devopsSkills.map((skill, index) => (
                <ProficiencyBar
                  key={skill.key}
                  label={skill.name}
                  value={skill.proficiency}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mernSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <ProficiencyBar
                  label={skill.name}
                  value={skill.proficiency}
                  delay={index * 0.05}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}