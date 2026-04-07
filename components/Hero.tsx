"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Download,
  FolderGit2,
  Globe,
  Mail,
  ServerCog,
} from "lucide-react";
import { personalInfo } from "@/lib/data";

export default function Hero() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const initials = useMemo(() => {
    return personalInfo.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden py-16 sm:py-20 lg:min-h-screen lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute right-10 top-40 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <motion.div
          animate={{ y: [0, -14, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[18%] h-3 w-3 rounded-full bg-accent/70"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[12%] top-[22%] h-2.5 w-2.5 rounded-full bg-cyan-400/70"
        />
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[18%] h-2.5 w-2.5 rounded-full bg-emerald-400/70"
        />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-medium text-accent sm:text-sm">
            <ServerCog className="h-4 w-4" />
            {personalInfo.title}
            <span className="hidden text-accent/70 sm:inline">•</span>
            <span className="hidden text-accent/80 sm:inline">
              Cloud • CI/CD • Kubernetes • Automation
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Hi, I’m{" "}
            <span className="bg-gradient-to-r from-white via-accent to-cyan-400 bg-clip-text text-transparent">
              {personalInfo.name}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {personalInfo.shortBio}
          </p>

          <blockquote className="mt-6 max-w-2xl border-l-4 border-accent pl-4 text-sm italic leading-8 text-slate-300 sm:text-base">
            "Building scalable cloud systems, automating deployments, and
            improving reliability through modern DevOps practices."
          </blockquote>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={personalInfo.seeResume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:scale-[1.02] hover:opacity-90 sm:w-auto"
            >
              View Resume
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={personalInfo.downloadResume}
              download={personalInfo.downloadResumeFileName}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent sm:w-auto"
            >
              Download CV
              <Download className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              <FolderGit2 className="h-4 w-4" />
              GitHub
            </a>

            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              LinkedIn
            </a>

            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              <Globe className="h-4 w-4" />
              Projects
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10"
        >
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative mx-auto w-full max-w-[560px] [perspective:1200px]"
          >
            <motion.div
              animate={{
                rotateX: rotate.x,
                rotateY: rotate.y,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 14 }}
              className="relative rounded-[32px] border border-border bg-card/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-accent/10 via-transparent to-cyan-400/10" />

              <div className="relative flex flex-col items-center">
                <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute h-full w-full rounded-full border border-accent/30"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className="absolute h-[82%] w-[82%] rounded-full border border-cyan-400/20"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    className="absolute h-[64%] w-[64%] rounded-full border border-emerald-400/20"
                  />

                  <motion.span
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-4 top-10 h-3 w-3 rounded-full bg-accent shadow-[0_0_24px_rgba(29,158,117,0.7)]"
                  />
                  <motion.span
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-5 top-14 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.7)]"
                  />
                  <motion.span
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-7 left-8 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)]"
                  />

                  <div
                    className="relative flex h-32 w-32 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent via-emerald-500 to-cyan-500 text-4xl font-black text-white shadow-2xl shadow-accent/30 sm:h-36 sm:w-36 sm:text-5xl"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {initials}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                    {personalInfo.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                    Cloud Infrastructure • CI/CD Automation • Kubernetes • AWS
                  </p>
                </div>

                <div className="mt-8 w-full rounded-2xl border border-border bg-background/70 p-4 shadow-inner">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-muted-foreground">
                      ashik@devops-machine ~ bash
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-xs leading-6 text-emerald-400 sm:text-sm">
                    <p>$ kubectl get nodes</p>
                    <p className="text-cyan-400">
                      master-node-01 &nbsp; Ready &nbsp; control-plane
                    </p>
                    <p className="text-cyan-400">
                      worker-node-01 &nbsp; Ready &nbsp; &lt;none&gt;
                    </p>
                    <p className="text-cyan-400">
                      worker-node-02 &nbsp; Ready &nbsp; &lt;none&gt;
                    </p>
                    <p>$ terraform show | grep status</p>
                    <p className="text-violet-400">
                      resource &quot;aws_eks_cluster&quot; &quot;main&quot; {"{"} status =
                      &quot;ACTIVE&quot; {"}"}
                    </p>
                    <p>$ prometheus scrape → grafana dashboard live</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}