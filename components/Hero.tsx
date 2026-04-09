"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
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
import ScrollIndicator from "@/components/ScollIndicator";

const centerWords = ["DEVOPS", "CI/CD", "K8S", "AWS", "LINUX", "DOCKER"];

const terminalLines = [
  "$ kubectl get nodes",
  "master-node-01   Ready   control-plane",
  "worker-node-01   Ready   <none>",
  "worker-node-02   Ready   <none>",
  "",
  "$ terraform show | grep status",
  'resource "aws_eks_cluster" "main" { status = "ACTIVE" }',
  "",
  "$ prometheus scrape → grafana dashboard live",
];

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  r: number;
};

export default function Hero() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [mouseGlow, setMouseGlow] = useState({ x: 50, y: 50 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);

  const initials = useMemo(() => {
    return personalInfo.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, []);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % centerWords.length);
    }, 1800);

    return () => clearInterval(wordTimer);
  }, []);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    terminalLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, index * 320);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999 };

    const createParticles = (width: number, height: number) => {
      const count = width < 640 ? 45 : 80;
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.8 + 0.8,
        };
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    const isDark =
      document.documentElement.classList.contains("dark") ||
      !document.documentElement.classList.contains("light");

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < 120) {
          const force = (120 - distMouse) / 120;
          const angle = Math.atan2(dyMouse, dxMouse);
          p.x += Math.cos(angle) * force * 1.8;
          p.y += Math.sin(angle) * force * 1.8;
        } else {
          p.x += (p.baseX - p.x) * 0.02;
          p.y += (p.baseY - p.y) * 0.02;
        }

        p.baseX += p.vx;
        p.baseY += p.vy;

        if (p.baseX <= 0 || p.baseX >= width) p.vx *= -1;
        if (p.baseY <= 0 || p.baseY >= height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? "rgba(29, 158, 117, 0.72)"
          : "rgba(29, 158, 117, 0.38)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = isDark
              ? `rgba(34, 211, 238, ${0.12 * (1 - dist / 100)})`
              : `rgba(34, 211, 238, ${0.07 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;

    setRotate({ x: rotateX, y: rotateY });
    setMouseGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleTiltLeave = () => {
    setRotate({ x: 0, y: 0 });
    setMouseGlow({ x: 50, y: 50 });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden py-16 sm:py-20 lg:min-h-screen lg:py-24"
    >
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-10 top-40 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-medium text-accent backdrop-blur-md sm:text-sm">
              <ServerCog className="h-4 w-4" />
              {personalInfo.title}
              <span className="hidden text-accent/70 sm:inline">•</span>
              <span className="hidden text-accent/80 sm:inline">
                Cloud • CI/CD • Kubernetes • Automation
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              Hi, I’m{" "}
              <span className="bg-gradient-to-r from-foreground via-accent to-cyan-400 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
            </h1>

            <div className="mt-4 h-10 sm:h-12">
              <TypeAnimation
                sequence={[
                  "DevOps Engineer",
                  1500,
                  "Cloud Architect",
                  1500,
                  "CI/CD Specialist",
                  1500,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-lg font-semibold text-accent sm:text-xl lg:text-2xl"
              />
            </div>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {personalInfo.shortBio}
            </p>

            <blockquote className="mt-6 max-w-2xl border-l-4 border-accent pl-4 text-sm italic leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-accent hover:text-accent sm:w-auto"
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
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md transition hover:border-accent hover:text-accent"
              >
                <FolderGit2 className="h-4 w-4" />
                GitHub
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md transition hover:border-accent hover:text-accent"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                LinkedIn
              </a>

              <a
                href={
                  personalInfo.email
                    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        personalInfo.email,
                      )}`
                    : "#"
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md transition hover:border-accent hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md transition hover:border-accent hover:text-accent"
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
            className="relative"
          >
            <div
              ref={rightPanelRef}
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              className="group relative mx-auto w-full max-w-[560px] [perspective:1200px]"
            >
              <motion.div
                animate={{
                  rotateX: rotate.x,
                  rotateY: rotate.y,
                }}
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
                className="relative rounded-[32px] border border-border bg-card/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-[32px] opacity-100"
                  style={{
                    background: `radial-gradient(circle at ${mouseGlow.x}% ${mouseGlow.y}%, rgba(29,158,117,0.16), transparent 24%), radial-gradient(circle at ${mouseGlow.x}% ${mouseGlow.y}%, rgba(34,211,238,0.14), transparent 42%)`,
                  }}
                />

                <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-accent/8 via-transparent to-cyan-400/8" />

                <div className="relative flex flex-col items-center">
                  <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute h-full w-full rounded-full border border-accent/25"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 26,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute h-[82%] w-[82%] rounded-full border border-cyan-400/20"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute h-[62%] w-[62%] rounded-full border border-emerald-400/20"
                    />

                    <motion.span
                      animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-5 top-12 h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_26px_rgba(29,158,117,0.7)]"
                    />
                    <motion.span
                      animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute right-4 top-16 h-3.5 w-3.5 rounded-full bg-cyan-400 shadow-[0_0_26px_rgba(34,211,238,0.7)]"
                    />
                    <motion.span
                      animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-8 left-9 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)]"
                    />

                    <motion.div
                      key={centerWords[activeWordIndex]}
                      initial={{ opacity: 0, scale: 0.86, rotateY: -20 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="relative flex h-32 w-32 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent via-emerald-500 to-cyan-500 text-center text-2xl font-black tracking-wide text-white shadow-2xl shadow-accent/30 sm:h-36 sm:w-36 sm:text-3xl"
                      style={{ transform: "translateZ(42px)" }}
                    >
                      {centerWords[activeWordIndex]}
                    </motion.div>
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

                    <div className="space-y-2 font-mono text-xs leading-6 sm:text-sm">
                      {visibleLines.map((line, index) => {
                        const isCommand = line.startsWith("$");
                        const isStatus =
                          line.includes("Ready") ||
                          line.includes("ACTIVE") ||
                          line.includes("live");
                        const isInfra = line.includes("resource");

                        return (
                          <motion.p
                            key={`${line}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.28 }}
                            className={
                              isCommand
                                ? "text-emerald-400"
                                : isStatus
                                  ? "text-cyan-400"
                                  : isInfra
                                    ? "text-violet-400"
                                    : "text-muted-foreground"
                            }
                          >
                            {line || "\u00A0"}
                          </motion.p>
                        );
                      })}

                      {visibleLines.length < terminalLines.length && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block h-5 w-2 bg-accent align-middle"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="mt-4flex justify-center lg:mt-4">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
