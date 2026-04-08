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
  | "nginx"
  | "jenkins";

type DisplaySkillKey = SkillKey | string;

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
  jenkins: "jenkins",
  argocd: "cicd",
};

const tabs = [
  { key: "devops", label: "DevOps" },
  { key: "mern", label: "MERN" },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabKey>("devops");
  const [activeSkill, setActiveSkill] = useState<SkillKey>("cicd");
  const [selectedCardKey, setSelectedCardKey] =
    useState<DisplaySkillKey>("aws");
  const [showAll, setShowAll] = useState(false);

  const skills = useMemo(
    () => (activeTab === "devops" ? devopsSkills : mernSkills),
    [activeTab],
  );

  const visibleSkills = showAll ? skills : skills.slice(0, 10);

  const firstInteractive = useMemo(() => {
    const found = skills.find((s) => interactiveMap[s.key]);
    return (found ? interactiveMap[found.key] : "cicd") || "cicd";
  }, [skills]);

  useEffect(() => {
    setShowAll(false);
    setActiveSkill(firstInteractive);
    setSelectedCardKey(skills[0]?.key || firstInteractive);
  }, [activeTab, firstInteractive, skills]);

  useEffect(() => {
    const el = document.getElementById(`skill-card-${selectedCardKey}`);
    el?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedCardKey]);

  const handleSkillClick = (skillKey: string) => {
    setSelectedCardKey(skillKey);

    const interactive = interactiveMap[skillKey];
    if (interactive) {
      setActiveSkill(interactive);
    }
  };

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.18] dark:opacity-[0.1]" />

        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-60px] top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-500/15"
        />

        <motion.div
          animate={{ x: [0, -70, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-70px] top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10"
        />

        <motion.div
          animate={{ x: [0, 25, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-teal-400/15 blur-3xl dark:bg-teal-400/10"
        />

        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -16, 0],
              opacity: [0.12, 0.45, 0.12],
              x: [0, i % 2 === 0 ? 6 : -6, 0],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-accent/70 dark:bg-accent/55"
            style={{
              width: 4 + (i % 4) * 2,
              height: 4 + (i % 4) * 2,
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
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
            Click a skill to explore how I use it in real DevOps workflows,
            deployments, automation, and production systems.
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
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 text-white shadow-[0_14px_36px_rgba(16,185,129,0.28)]"
                    : "border border-border bg-card/70 text-muted-foreground hover:border-accent/25 hover:bg-card hover:text-foreground"
                }`}
              >
                <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleSkills.map((skill, index) => {
            const Icon = skill.icon;
            const isSelected = selectedCardKey === skill.key;
            const isInteractive = !!interactiveMap[skill.key];

            return (
              <motion.button
                id={`skill-card-${skill.key}`}
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
                onClick={() => handleSkillClick(skill.key)}
                className={`group relative overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 sm:p-5 ${
                  isSelected
                    ? "border-accent/50 bg-gradient-to-br from-accent/16 via-card to-cyan-400/12 shadow-[0_22px_55px_rgba(16,185,129,0.2)] ring-1 ring-accent/30"
                    : "border-border/80 bg-card/70 hover:border-accent/25 hover:shadow-[0_18px_45px_rgba(16,185,129,0.08)]"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {isSelected && (
                  <>
                    <motion.div
                      layoutId="active-skill-outline"
                      className="absolute inset-0 rounded-3xl border border-accent/50"
                    />
                    <motion.div
                      animate={{ opacity: [0.25, 0.5, 0.25] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-3xl bg-accent/5"
                    />
                  </>
                )}

                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 3 + (index % 4),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex items-start justify-between gap-3"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm backdrop-blur-sm transition-all duration-300 ${
                      isSelected
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-border/70 bg-background/75 text-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all duration-300 ${
                      isSelected
                        ? "bg-accent text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                        : skill.proficiency >= 90
                          ? "bg-accent/15 text-accent"
                          : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                    }`}
                  >
                    {skill.proficiency}%
                  </div>
                </motion.div>

                <div className="relative mt-4">
                  <h3
                    className={`text-sm font-bold sm:text-base ${
                      isSelected ? "text-accent" : "text-foreground"
                    }`}
                  >
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
                      transition={{
                        duration: 0.85,
                        delay: 0.06 + index * 0.02,
                      }}
                      className={`h-full rounded-full ${
                        isSelected
                          ? "bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
                          : "bg-gradient-to-r from-accent/80 via-emerald-400 to-cyan-400"
                      }`}
                    />
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-medium ${
                      isSelected ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {isInteractive ? "Interactive" : "Overview"}
                  </span>

                  {isInteractive ? (
                    <motion.span
                      animate={isSelected ? { x: [0, 4, 0] } : { x: 0 }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className={`text-[11px] font-semibold ${
                        isSelected ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {isSelected ? "Selected" : "Click to open"}
                    </motion.span>
                  ) : (
                    <span
                      className={`text-[11px] font-semibold ${
                        isSelected ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {isSelected ? "Selected" : "Static"}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {skills.length > 10 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(16,185,129,0.2)] transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative">
                {showAll ? "Show Less" : "Show More"}
              </span>
            </button>
          </div>
        )}

        {activeTab === "devops" && (
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
