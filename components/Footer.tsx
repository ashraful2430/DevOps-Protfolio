"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  GitBranch,
  Link,
  Mail,
  Heart,
  FolderGit2,
} from "lucide-react";
import { personalInfo } from "@/lib/data";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: personalInfo.github,
    icon: GitBranch,
  },
  {
    label: "LinkedIn",
    href: personalInfo.linkedin,
    icon: Link,
  },
  {
    label: "Email",
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
  },
  {
    label: "Resume",
    href: personalInfo.seeResume,
    icon: FolderGit2,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 py-12 sm:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-6 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-[12%] bottom-4 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] border border-border bg-card/60 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-medium text-accent sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_rgba(29,158,117,0.8)]" />
                  DevOps Engineer
                </div>

                <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {personalInfo.name}
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  I build scalable cloud systems, reliable deployment workflows,
                  and automation-driven solutions with a strong focus on DevOps,
                  infrastructure, monitoring, and engineering quality.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.06 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.label === "Email" ? undefined : "_blank"}
                      rel={item.label === "Email" ? undefined : "noreferrer"}
                      className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm text-muted-foreground transition hover:border-accent hover:text-accent"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  );
                })}
              </motion.div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.08 }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">
                  Navigation
                </h4>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {footerLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center text-sm text-muted-foreground transition hover:text-accent"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.12 }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">
                  Contact
                </h4>

                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>{personalInfo.email}</p>
                  {personalInfo.phone && <p>{personalInfo.phone}</p>}
                  <p>Bangladesh</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {personalInfo.name}. All rights
              reserved.
            </p>

            <p className="inline-flex items-center gap-2">
              Built with <Heart className="h-4 w-4 fill-current text-red-400" />{" "}
              using Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
