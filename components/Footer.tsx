"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  GitBranch,
  Link,
  Mail,
  Heart,
  FileText,
  Sparkles,
} from "lucide-react";
import { personalInfo } from "@/lib/data";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Live Products", href: "#live-products" },
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
    icon: FileText,
  },
];

function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: 5 + (i % 4) * 5,
        left: `${5 + i * 7}%`,
        duration: 7 + (i % 5),
        delay: i * 0.4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-foreground/10"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: "-30px",
          }}
          animate={{
            y: [-10, -220],
            x: [0, p.id % 2 ? 15 : -15, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120,120,120,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120,120,120,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 py-14">
      <AnimatedGrid />
      <FloatingParticles />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-[10%] top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-[10%] bottom-10 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-[32px] border border-border bg-card/70 p-6 backdrop-blur-2xl sm:p-10"
        >
          <div className="grid gap-10 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Let’s Connect
              </div>

              <h3 className="mt-5 text-3xl font-bold text-foreground">
                {personalInfo.name}
              </h3>

              <p className="mt-4 text-muted-foreground max-w-xl">
                Building scalable systems, automating infrastructure, and
                creating reliable cloud-native solutions with modern DevOps
                practices.
              </p>

              {/* SOCIAL */}
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.a
                      whileHover={{ y: -3, scale: 1.03 }}
                      key={item.label}
                      href={item.href}
                      target={item.label === "Email" ? undefined : "_blank"}
                      className="group flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2 text-sm text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/40 transition"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* RIGHT */}
            <div className="grid gap-8 sm:grid-cols-2">
              {/* NAV */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Navigation
                </h4>
                <div className="space-y-2">
                  {footerLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-emerald-500 transition"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* CONTACT */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Contact
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{personalInfo.email}</p>
                  {"phone" in personalInfo && personalInfo.phone && (
                    <p>{personalInfo.phone}</p>
                  )}
                  <p>Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {personalInfo.name}
            </p>

            <p className="flex items-center gap-2">
              Built with <Heart className="h-4 w-4 text-red-500 fill-current" />
              Next.js
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
