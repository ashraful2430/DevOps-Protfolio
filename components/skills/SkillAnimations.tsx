"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Database,
  GitBranch,
  Globe,
  Layers3,
  Server,
  Settings2,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type StepStatus = "idle" | "running" | "done" | "failed";

interface PipelineStep {
  id: string;
  label: string;
  icon: string;
  command: string;
  duration: number;
  logLines: string[];
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "push",
    label: "Code Push",
    icon: "⬆",
    command: "git push origin main",
    duration: 700,
    logLines: [
      "$ git push origin main",
      "Enumerating objects: 12, done.",
      "Counting objects: 100% (12/12)",
      "Writing objects: 100% (7/7), 1.23 KiB",
      "✓ Branch 'main' pushed to origin",
    ],
  },
  {
    id: "build",
    label: "Build",
    icon: "🔨",
    command: "npm run build",
    duration: 900,
    logLines: [
      "$ npm run build",
      "Installing dependencies...",
      "▸ Compiling TypeScript...",
      "▸ Bundling assets...",
      "✓ Build complete — 2.1s",
    ],
  },
  {
    id: "test",
    label: "Test",
    icon: "🧪",
    command: "npm run test -- --ci",
    duration: 800,
    logLines: [
      "$ npm run test -- --ci",
      "PASS src/components/Hero.test.tsx",
      "PASS src/components/Skills.test.tsx",
      "PASS src/lib/data.test.ts",
      "✓ 47 tests passed · 0 failed",
    ],
  },
  {
    id: "docker",
    label: "Docker",
    icon: "🐳",
    command: "docker build -t my-app:latest .",
    duration: 1000,
    logLines: [
      "$ docker build -t my-app:sha-abc123 .",
      "Step 1/6 : FROM node:18-alpine",
      "Step 4/6 : RUN npm install",
      'Step 6/6 : CMD ["node","server.js"]',
      "✓ Image built — 247MB · sha-abc123",
    ],
  },
  {
    id: "push-ecr",
    label: "Push ECR",
    icon: "📦",
    command: "docker push ecr.aws/my-app",
    duration: 800,
    logLines: [
      "$ docker push 123.ecr.aws/my-app:sha-abc123",
      "Pushing layer 1/4...",
      "Pushing layer 4/4...",
      "Digest: sha256:9f86d08...",
      "✓ Image pushed to registry",
    ],
  },
  {
    id: "argocd",
    label: "ArgoCD",
    icon: "🔀",
    command: "argocd app sync my-app",
    duration: 900,
    logLines: [
      "$ argocd app sync my-app",
      "Syncing app 'my-app'...",
      "Detecting new image sha-abc123",
      "Rolling update: 0/3 → 3/3",
      "✓ App synced · Health: Healthy",
    ],
  },
  {
    id: "deploy",
    label: "K8s Deploy",
    icon: "☸",
    command: "kubectl rollout status deploy/my-app",
    duration: 1000,
    logLines: [
      "$ kubectl rollout status deploy/my-app",
      'Waiting for "my-app" to roll out...',
      "✓ Pod my-app-7d9f8b-xkj2p: Running",
      "✓ Pod my-app-7d9f8b-mn3qr: Running",
      "✓ Deployment complete · 3/3 pods ready",
    ],
  },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function PanelShell({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-border/70 bg-background/45 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function StatusBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "success" | "warning";
}) {
  const styles =
    tone === "success"
      ? "border-accent/30 bg-gradient-to-r from-accent/15 to-emerald-400/10 text-accent"
      : tone === "warning"
        ? "border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 to-amber-400/10 text-yellow-300"
        : "border-border bg-card/70 text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${styles}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "success"
            ? "bg-accent"
            : tone === "warning"
              ? "bg-yellow-400"
              : "bg-muted-foreground/40"
        }`}
      />
      {label}
    </span>
  );
}

function TerminalBox({
  lines,
  title = "ashik@devops-machine",
  heightClass = "h-[350px]",
}: {
  lines: string[];
  title?: string;
  heightClass?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-2 border-b border-border/70 bg-card/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[11px] text-muted-foreground">{title}</span>
      </div>

      <div
        className={`${heightClass} overflow-y-auto px-4 py-4 font-mono text-xs leading-6 sm:text-sm`}
      >
        {lines.map((line, index) => (
          <motion.p
            key={`${line}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className={
              line.startsWith("✓") || line.startsWith("PASS")
                ? "text-accent"
                : line.startsWith("$")
                  ? "text-foreground"
                  : line.includes("failed")
                    ? "text-red-400"
                    : "text-muted-foreground"
            }
          >
            {line || "\u00A0"}
          </motion.p>
        ))}

        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block h-4 w-2 bg-accent align-middle"
        />
      </div>
    </div>
  );
}

function TinyProgress({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-border/60">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
      />
    </div>
  );
}

function MiniCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-3 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function StepCard({
  step,
  status,
  onClick,
}: {
  step: PipelineStep;
  status: StepStatus;
  onClick: () => void;
}) {
  const isDone = status === "done";
  const isRunning = status === "running";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex h-[104px] min-w-0 flex-col items-center justify-center rounded-[20px] border px-2 py-3 text-center transition-all duration-300 sm:h-[110px] md:h-[98px] ${
        isDone
          ? "border-accent/35 bg-gradient-to-b from-accent/14 to-accent/5 shadow-[0_0_22px_rgba(29,158,117,0.12)]"
          : isRunning
            ? "border-yellow-500/35 bg-gradient-to-b from-yellow-500/14 to-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.12)]"
            : "border-border/70 bg-card/45 hover:border-accent/20 hover:bg-card/65"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_58%)]" />
      {isRunning && (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 1.3, repeat: Infinity }}
          className="absolute inset-[-1px] rounded-[20px] border border-yellow-500/30"
        />
      )}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-base ${
          isDone
            ? "border-accent/30 bg-accent/12 text-accent"
            : isRunning
              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
              : "border-border/60 bg-background/70 text-foreground"
        }`}
      >
        {isDone ? "✓" : step.icon}
      </div>
      <div className="mt-3 text-[11px] font-semibold leading-4 text-foreground">
        {step.label}
      </div>
      <div
        className={`mt-3 h-1.5 w-1.5 rounded-full ${
          isDone
            ? "bg-accent"
            : isRunning
              ? "bg-yellow-400 animate-pulse"
              : "bg-border"
        }`}
      />
    </motion.button>
  );
}

function StepConnector({ lit }: { lit: boolean }) {
  return (
    <div className="flex h-[86px] items-center justify-center sm:h-[94px] md:h-[98px]">
      <div className="relative h-8 w-5 sm:w-6 md:w-7">
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-border/50" />
        {lit && (
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 origin-left rounded-full bg-accent"
          />
        )}

        <motion.div
          animate={{
            opacity: lit ? 1 : 0.45,
            scale: lit ? [1, 1.06, 1] : 1,
            x: lit ? [0, 3, 0] : 0,
          }}
          transition={
            lit
              ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/95 px-0.5 text-sm font-black sm:text-base ${
            lit
              ? "text-accent drop-shadow-[0_0_8px_rgba(29,158,117,0.45)]"
              : "text-muted-foreground"
          }`}
        >
          →
        </motion.div>
      </div>
    </div>
  );
}

export function CICDAnimation() {
  const [statuses, setStatuses] = useState<StepStatus[]>(
    PIPELINE_STEPS.map(() => "idle"),
  );
  const [connectors, setConnectors] = useState<boolean[]>(
    PIPELINE_STEPS.map(() => false),
  );
  const [logLines, setLogLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const doneCount = statuses.filter((s) => s === "done").length;
  const progress = Math.round((doneCount / PIPELINE_STEPS.length) * 100);
  const currentStep = activeStep !== null ? PIPELINE_STEPS[activeStep] : null;

  function reset() {
    setStatuses(PIPELINE_STEPS.map(() => "idle"));
    setConnectors(PIPELINE_STEPS.map(() => false));
    setLogLines([]);
    setRunning(false);
    setFinished(false);
    setActiveStep(null);
  }

  async function runPipeline() {
    if (running) return;
    reset();
    await sleep(80);
    setRunning(true);

    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      const step = PIPELINE_STEPS[i];

      setStatuses((prev) => {
        const next = [...prev];
        next[i] = "running";
        return next;
      });
      setActiveStep(i);

      for (const line of step.logLines) {
        await sleep(
          Math.max(120, Math.floor(step.duration / step.logLines.length)),
        );
        setLogLines((prev) => [...prev, line]);
      }

      setStatuses((prev) => {
        const next = [...prev];
        next[i] = "done";
        return next;
      });

      if (i < PIPELINE_STEPS.length - 1) {
        setConnectors((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }
    }

    setRunning(false);
    setFinished(true);
  }

  function handleStepClick(idx: number) {
    if (statuses[idx] === "idle" && !running && !finished) return;
    setActiveStep(idx);
  }

  return (
    <PanelShell
      title="CI/CD Pipeline — how it works"
      subtitle="GitLab CI + ArgoCD + Kubernetes"
      action={
        <StatusBadge
          label={running ? "Running" : finished ? "Done" : "Idle"}
          tone={running ? "warning" : finished ? "success" : "default"}
        />
      }
    >
      <div className="space-y-5">
        <div className="rounded-[24px] border border-border/70 bg-gradient-to-b from-card/60 to-background/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-4">
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {PIPELINE_STEPS.map((step, i) => (
              <StepCard
                key={step.id}
                step={step}
                status={statuses[i]}
                onClick={() => handleStepClick(i)}
              />
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.id} className="contents">
                <StepCard
                  step={step}
                  status={statuses[i]}
                  onClick={() => handleStepClick(i)}
                />
                {i < PIPELINE_STEPS.length - 1 && (
                  <StepConnector lit={connectors[i]} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="min-w-[56px] text-xs text-muted-foreground">
              Progress
            </span>
            <div className="flex-1">
              <TinyProgress value={progress} />
            </div>
            <span className="min-w-[40px] text-right text-xs font-semibold text-accent">
              {progress}%
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-border bg-gradient-to-r from-background/80 to-card/50 px-4 py-3 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/80">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {currentStep.label}
                    </p>
                    <p className="mt-1 break-words font-mono text-xs leading-5 text-accent">
                      $ {currentStep.command}
                    </p>
                  </div>
                </div>

                <StatusBadge
                  label={
                    statuses[activeStep!] === "done"
                      ? "Done"
                      : statuses[activeStep!] === "running"
                        ? "Running"
                        : "Idle"
                  }
                  tone={
                    statuses[activeStep!] === "done"
                      ? "success"
                      : statuses[activeStep!] === "running"
                        ? "warning"
                        : "default"
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <TerminalBox
          lines={logLines}
          title="ashik@devops-machine — pipeline log"
        />

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            animate={
              running
                ? {
                    boxShadow: [
                      "0 0 0 rgba(29,158,117,0.18)",
                      "0 0 22px rgba(29,158,117,0.35)",
                      "0 0 0 rgba(29,158,117,0.18)",
                    ],
                  }
                : {
                    boxShadow: [
                      "0 10px 24px rgba(29,158,117,0.18)",
                      "0 14px 30px rgba(29,158,117,0.28)",
                      "0 10px 24px rgba(29,158,117,0.18)",
                    ],
                  }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            onClick={runPipeline}
            disabled={running}
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 sm:px-6 sm:py-3.5 ${
              running
                ? "cursor-not-allowed bg-gradient-to-r from-accent/80 via-emerald-500/80 to-cyan-500/80"
                : "bg-gradient-to-r from-accent via-emerald-500 to-cyan-500"
            }`}
          >
            <span className="flex items-center gap-2">
              <motion.span
                animate={running ? { rotate: 360 } : { x: [0, 2, 0] }}
                transition={
                  running
                    ? { duration: 1, repeat: Infinity, ease: "linear" }
                    : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="text-base"
              >
                {running ? "⟳" : "▶"}
              </motion.span>
              <span>{running ? "Pipeline Running" : "Run Pipeline"}</span>
            </span>
          </motion.button>

          {(finished || doneCount > 0) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={reset}
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-muted-foreground backdrop-blur-md transition-all duration-300 hover:bg-card sm:px-5 sm:py-3.5"
            >
              <span className="mr-2">↺</span>
              Reset
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent shadow-[0_0_24px_rgba(29,158,117,0.1)]"
            >
              <span className="text-base">✓</span>
              <span>
                Deployment complete · 3/3 pods running · zero downtime rollout
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PanelShell>
  );
}

export function DockerAnimation() {
  const stages = [
    {
      title: "Base Image",
      detail: "node:20-alpine",
      command: "FROM node:20-alpine AS base",
    },
    {
      title: "Dependencies",
      detail: "Install only needed packages",
      command: "RUN npm ci",
    },
    {
      title: "Build Stage",
      detail: "Compile production assets",
      command: "RUN npm run build",
    },
    {
      title: "Runtime Image",
      detail: "Copy only required output",
      command: "COPY --from=builder /app/dist ./dist",
    },
    {
      title: "Secure Start",
      detail: "Run app with lean final image",
      command: 'CMD ["node","dist/server.js"]',
    },
  ];

  const [started, setStarted] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [built, setBuilt] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([
    "# Multi-stage production Docker build ready",
    "# Click the button below to simulate the build",
  ]);

  async function runDockerBuild() {
    if (started) return;

    setStarted(true);
    setBuilt(false);
    setActiveStage(-1);
    setLogLines([
      "$ docker build -t portfolio-app:prod .",
      "Loading build context...",
      "Using .dockerignore for cleaner context...",
    ]);

    for (let i = 0; i < stages.length; i++) {
      setActiveStage(i);

      await sleep(700);

      setLogLines((prev) => [
        ...prev,
        "",
        `# Stage ${i + 1}: ${stages[i].title}`,
        `$ ${stages[i].command}`,
        `✓ ${stages[i].detail}`,
      ]);
    }

    await sleep(500);

    setLogLines((prev) => [
      ...prev,
      "",
      "✓ Multi-stage image built successfully",
      "✓ Final image size optimized",
      "✓ Production container ready to run",
      "$ docker run -d -p 3000:3000 portfolio-app:prod",
    ]);

    setBuilt(true);
    setStarted(false);
  }

  function resetDockerBuild() {
    setStarted(false);
    setBuilt(false);
    setActiveStage(-1);
    setLogLines([
      "# Multi-stage production Docker build ready",
      "# Click the button below to simulate the build",
    ]);
  }

  return (
    <PanelShell
      title="Docker — production-grade build flow"
      subtitle="Multi-stage build → optimized image → secure runtime container"
      action={
        <StatusBadge
          label={started ? "Building" : built ? "Built" : "Ready"}
          tone={started ? "warning" : built ? "success" : "default"}
        />
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/55 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Production Docker Stages
              </p>
              <span className="text-xs text-muted-foreground">
                Multi-stage optimized flow
              </span>
            </div>

            <div className="space-y-3">
              {stages.map((stage, i) => {
                const isDone = built ? true : i < activeStage;
                const isActive = i === activeStage && started;

                return (
                  <motion.div
                    key={stage.title}
                    animate={{
                      opacity: isDone || isActive ? 1 : 0.55,
                      scale: isActive ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border px-4 py-3 ${
                      isActive
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : isDone
                          ? "border-accent/30 bg-accent/10"
                          : "border-border/70 bg-background/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {stage.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stage.detail}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          isActive
                            ? "bg-yellow-500/15 text-yellow-300"
                            : isDone
                              ? "bg-accent/15 text-accent"
                              : "bg-card text-muted-foreground"
                        }`}
                      >
                        {isActive ? "Running" : isDone ? "Done" : "Pending"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <TinyProgress value={isDone ? 100 : isActive ? 65 : 8} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MiniCard
              title="Final Image"
              value={built ? "118 MB" : "Pending"}
              icon={<Layers3 className="h-4 w-4" />}
            />
            <MiniCard
              title="Runtime"
              value={built ? "Secure" : "Not Built"}
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={runDockerBuild}
              disabled={started}
              className={`rounded-2xl px-5 py-3 text-sm font-bold text-white transition ${
                started
                  ? "cursor-not-allowed bg-accent/60"
                  : "bg-gradient-to-r from-accent via-emerald-500 to-cyan-500"
              }`}
            >
              {started ? "Building..." : "Run Production Docker Build"}
            </button>

            {(built || activeStage >= 0) && (
              <button
                onClick={resetDockerBuild}
                className="rounded-2xl border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-card"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/55 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Production Dockerfile
            </p>

            <TerminalBox
              title="Dockerfile.prod"
              lines={[
                "FROM node:20-alpine AS base",
                "WORKDIR /app",
                "",
                "FROM base AS deps",
                "COPY package*.json ./",
                "RUN npm ci",
                "",
                "FROM base AS builder",
                "COPY --from=deps /app/node_modules ./node_modules",
                "COPY . .",
                "RUN npm run build",
                "",
                "FROM node:20-alpine AS runtime",
                "WORKDIR /app",
                "COPY --from=builder /app/dist ./dist",
                'CMD ["node","dist/server.js"]',
              ]}
            />
          </div>

          <TerminalBox
            lines={logLines}
            title="ashik@docker-builder — production build log"
          />
        </div>
      </div>
    </PanelShell>
  );
}

export function K8sAnimation() {
  const [pods, setPods] = useState([
    { id: 1, name: "api-7f91", status: "Running" },
    { id: 2, name: "web-5d72", status: "Running" },
    { id: 3, name: "worker-3a11", status: "Running" },
  ]);
  const [replicas, setReplicas] = useState(3);

  function restartPod(id: number) {
    setPods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Restarting" } : p)),
    );
    setTimeout(() => {
      setPods((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Running" } : p)),
      );
    }, 1400);
  }

  function scaleUp() {
    const next = replicas + 1;
    setReplicas(next);
    setPods((prev) => [
      ...prev,
      { id: Date.now(), name: `pod-${next}a2`, status: "Running" },
    ]);
  }

  return (
    <PanelShell
      title="Kubernetes — self-healing cluster"
      subtitle="Pods recover automatically and scale on demand"
      action={<StatusBadge label={`${replicas} Replicas`} tone="success" />}
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pods.map((pod) => (
            <motion.button
              key={pod.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => restartPod(pod.id)}
              className="rounded-2xl border border-border/70 bg-card/60 p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {pod.name}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    pod.status === "Running"
                      ? "bg-accent/12 text-accent"
                      : "bg-yellow-500/12 text-yellow-300"
                  }`}
                >
                  {pod.status}
                </span>
              </div>
              <div className="mt-4">
                <TinyProgress value={pod.status === "Running" ? 100 : 38} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Click pod to simulate restart & self-heal.
              </p>
            </motion.button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={scaleUp}
            className="rounded-2xl bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white"
          >
            Scale +1
          </button>
        </div>
      </div>
    </PanelShell>
  );
}

export function TerraformAnimation() {
  const resources = [
    "aws_vpc.main",
    "aws_subnet.public",
    "aws_security_group.app",
    "aws_db_instance.postgres",
    "aws_lb.main",
    "aws_eks_cluster.core",
  ];
  const [applied, setApplied] = useState(false);
  const [index, setIndex] = useState(-1);

  async function applyPlan() {
    if (applied) {
      setApplied(false);
      setIndex(-1);
      return;
    }

    for (let i = 0; i < resources.length; i++) {
      setIndex(i);
      await sleep(700);
    }
    setApplied(true);
  }

  const logLines = useMemo(() => {
    const base = [
      "$ terraform plan",
      "Plan: 6 to add, 0 to change, 0 to destroy.",
      "",
      "$ terraform apply -auto-approve",
    ];
    const items = resources
      .slice(0, Math.max(index + 1, 0))
      .flatMap((r) => [`${r}: Creating...`, `✓ ${r}: Creation complete`]);
    return [...base, ...items];
  }, [index]);

  return (
    <PanelShell
      title="Terraform — infrastructure as code"
      subtitle="Plan → Apply → Resources provisioned in sequence"
      action={
        <StatusBadge
          label={applied ? "Applied" : "Ready"}
          tone={applied ? "success" : "default"}
        />
      }
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          {resources.map((r, i) => {
            const live = i <= index;
            return (
              <motion.div
                key={r}
                animate={{ opacity: live ? 1 : 0.55, scale: live ? 1.01 : 1 }}
                className={`rounded-xl border px-4 py-3 ${
                  live
                    ? "border-accent/30 bg-accent/10"
                    : "border-border/70 bg-card/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{r}</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {live ? "Provisioned" : "Pending"}
                  </span>
                </div>
              </motion.div>
            );
          })}

          <button
            onClick={applyPlan}
            className="rounded-2xl bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white"
          >
            {applied ? "Reset Apply" : "Apply Plan"}
          </button>
        </div>

        <TerminalBox lines={logLines} title="terraform@iac-runner" />
      </div>
    </PanelShell>
  );
}

export function AnsibleAnimation() {
  const hosts = ["web-01", "web-02", "worker-01", "db-01"];
  const tasks = [
    "Install packages",
    "Sync config",
    "Restart services",
    "Health check",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((p) => (p + 1) % tasks.length), 1300);
    return () => clearInterval(t);
  }, []);

  return (
    <PanelShell
      title="Ansible — remote automation flow"
      subtitle="Inventory → Playbook → Tasks executed across nodes"
      action={<StatusBadge label="Automating" tone="warning" />}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <p className="mb-4 text-sm font-semibold text-foreground">Hosts</p>
          <div className="space-y-3">
            {hosts.map((host) => (
              <div
                key={host}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3"
              >
                <span className="text-sm text-foreground">{host}</span>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase text-accent">
                  Connected
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <p className="mb-4 text-sm font-semibold text-foreground">
            Playbook Tasks
          </p>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <motion.div
                key={task}
                animate={{
                  opacity: i <= step ? 1 : 0.45,
                  x: i === step ? [0, 4, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl border px-4 py-3 ${
                  i < step
                    ? "border-accent/30 bg-accent/10"
                    : i === step
                      ? "border-yellow-500/30 bg-yellow-500/10"
                      : "border-border/70 bg-background/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{task}</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {i < step ? "Done" : i === step ? "Running" : "Queued"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function AWSAnimation() {
  const services = [
    { key: "ec2", label: "EC2", desc: "Compute for app workloads" },
    { key: "vpc", label: "VPC", desc: "Secure network isolation" },
    { key: "alb", label: "ALB", desc: "Load balancing traffic" },
    { key: "rds", label: "RDS", desc: "Managed relational DB" },
    { key: "s3", label: "S3", desc: "Object storage" },
    { key: "iam", label: "IAM", desc: "Access control" },
  ];

  const [active, setActive] = useState(services[0]);

  return (
    <PanelShell
      title="AWS — service architecture view"
      subtitle="Traffic and services flowing through a production stack"
      action={<StatusBadge label={active.label} tone="success" />}
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {services.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active.key === s.key
                    ? "border-accent/35 bg-accent/10"
                    : "border-border/70 bg-background/60 hover:border-accent/20"
                }`}
              >
                <div className="text-sm font-semibold text-foreground">
                  {s.label}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-border/70 bg-background/60 p-5">
            <div className="grid grid-cols-3 items-center gap-3 text-center">
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                <Globe className="mx-auto h-5 w-5 text-accent" />
                <p className="mt-2 text-xs font-semibold text-foreground">
                  Users
                </p>
              </div>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-accent"
              >
                →
              </motion.div>
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                <ShieldCheck className="mx-auto h-5 w-5 text-accent" />
                <p className="mt-2 text-xs font-semibold text-foreground">
                  {active.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
          <p className="text-lg font-bold text-foreground">{active.label}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {active.desc}
          </p>

          <div className="mt-6 grid gap-4">
            <MiniCard
              title="Latency"
              value="42 ms"
              icon={<Activity className="h-4 w-4" />}
            />
            <MiniCard
              title="Availability"
              value="99.95%"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function PrometheusAnimation() {
  const [spike, setSpike] = useState(false);
  const points = spike
    ? [25, 30, 45, 56, 72, 89, 78, 66]
    : [18, 22, 21, 25, 28, 32, 30, 26];
  const alert = spike;

  return (
    <PanelShell
      title="Prometheus — monitoring & alerting"
      subtitle="Metrics rise, threshold hits, alert gets triggered"
      action={
        <StatusBadge
          label={alert ? "Alerting" : "Healthy"}
          tone={alert ? "warning" : "success"}
        />
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <div className="flex h-56 items-end gap-3">
            {points.map((p, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${p}%` }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className={`w-full rounded-t-xl ${
                  alert && i >= 4
                    ? "bg-gradient-to-t from-red-500 to-yellow-400"
                    : "bg-gradient-to-t from-accent to-cyan-400"
                }`}
              />
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setSpike((s) => !s)}
              className="rounded-2xl bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white"
            >
              {spike ? "Reset Metrics" : "Simulate Spike"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <MiniCard
            title="CPU Usage"
            value={alert ? "89%" : "32%"}
            icon={<Activity className="h-4 w-4" />}
          />
          <MiniCard
            title="Requests/sec"
            value={alert ? "1.8k" : "640"}
            icon={<Server className="h-4 w-4" />}
          />
          <div
            className={`rounded-2xl border p-4 ${alert ? "border-red-500/30 bg-red-500/10" : "border-border/70 bg-card/60"}`}
          >
            <p className="text-sm font-semibold text-foreground">
              Alert Manager
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {alert
                ? "High CPU alert fired and notification dispatched."
                : "No active alerts. Everything looks healthy."}
            </p>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function GitAnimation() {
  const commits = [
    "feat: add metrics endpoint",
    "fix: update nginx upstream",
    "chore: improve deploy workflow",
    "refactor: cleanup docker image",
  ];
  const [selected, setSelected] = useState(0);

  return (
    <PanelShell
      title="Git Flow — collaborative development"
      subtitle="Feature branches merge cleanly into main"
      action={<StatusBadge label="Versioned" tone="success" />}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
          <div className="space-y-5">
            {commits.map((commit, i) => (
              <button
                key={commit}
                onClick={() => setSelected(i)}
                className="flex w-full items-center gap-4 text-left"
              >
                <div className="flex flex-col items-center">
                  <motion.span
                    animate={{ scale: selected === i ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`h-4 w-4 rounded-full ${
                      selected === i ? "bg-accent" : "bg-border"
                    }`}
                  />
                  {i < commits.length - 1 && (
                    <span className="mt-1 h-10 w-[2px] bg-border" />
                  )}
                </div>
                <div
                  className={`rounded-2xl border px-4 py-3 ${selected === i ? "border-accent/30 bg-accent/10" : "border-border/70 bg-background/60"}`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {commit}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-accent" />
            <p className="text-lg font-bold text-foreground">Selected Commit</p>
          </div>
          <p className="mt-4 rounded-xl border border-border/70 bg-background/60 px-4 py-3 font-mono text-sm text-accent">
            {commits[selected]}
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This visual represents how feature changes move through branches and
            merge into the deployment workflow.
          </p>
        </div>
      </div>
    </PanelShell>
  );
}

export function LinuxAnimation() {
  const commands = [
    "$ top",
    "$ df -h",
    "$ free -m",
    "$ ss -tulpn",
    "$ journalctl -u nginx",
  ];
  const outputs: Record<string, string[]> = {
    "$ top": [
      "$ top",
      "load average: 0.42, 0.51, 0.48",
      "Tasks: 182 total, 1 running",
      "%Cpu(s): 12.1 us, 4.8 sy, 82.1 id",
    ],
    "$ df -h": [
      "$ df -h",
      "/dev/sda1   40G   18G   20G  48% /",
      "/dev/sdb1  100G   51G   44G  54% /data",
    ],
    "$ free -m": [
      "$ free -m",
      "Mem: 7986  4210  2100   120  1676  3332",
      "Swap: 2047   120  1927",
    ],
    "$ ss -tulpn": [
      "$ ss -tulpn",
      "tcp LISTEN 0 511 0.0.0.0:80 nginx",
      "tcp LISTEN 0 511 0.0.0.0:443 nginx",
      "tcp LISTEN 0 128 0.0.0.0:3000 node",
    ],
    "$ journalctl -u nginx": [
      "$ journalctl -u nginx",
      "nginx[412]: reload complete",
      "nginx[412]: upstream healthy",
      "nginx[412]: accepting connections",
    ],
  };

  const [selected, setSelected] = useState(commands[0]);

  return (
    <PanelShell
      title="Linux — command-line operations"
      subtitle="Common DevOps commands with live styled output"
      action={<StatusBadge label="CLI" tone="default" />}
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {commands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => setSelected(cmd)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                selected === cmd
                  ? "border-accent/30 bg-accent/10"
                  : "border-border/70 bg-card/60"
              }`}
            >
              <span className="font-mono text-sm text-foreground">{cmd}</span>
              <TerminalSquare className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <TerminalBox
          lines={outputs[selected]}
          title="ashik@linux-node — shell"
        />
      </div>
    </PanelShell>
  );
}

export function NginxAnimation() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSent((p) => !p), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <PanelShell
      title="Nginx — reverse proxy request flow"
      subtitle="Requests route through Nginx to healthy upstreams"
      action={<StatusBadge label="Proxying" tone="success" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 text-center">
            <Globe className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-3 text-sm font-semibold text-foreground">Client</p>
          </div>

          <motion.div
            animate={
              sent
                ? { x: [0, 10, 0], opacity: [0.5, 1, 0.5] }
                : { opacity: 0.35 }
            }
            transition={{ duration: 1.2, repeat: Infinity }}
            className="hidden text-center text-2xl text-accent md:block"
          >
            →
          </motion.div>

          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 text-center shadow-[0_0_22px_rgba(16,185,129,0.12)]">
            <Server className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              Nginx Proxy
            </p>
          </div>

          <motion.div
            animate={
              sent
                ? { x: [0, 10, 0], opacity: [0.5, 1, 0.5] }
                : { opacity: 0.35 }
            }
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            className="hidden text-center text-2xl text-accent md:block"
          >
            →
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {["app-1", "app-2"].map((upstream, i) => (
              <div
                key={upstream}
                className={`rounded-2xl border p-4 text-center ${sent && i === 0 ? "border-accent/30 bg-accent/10" : "border-border/70 bg-card/60"}`}
              >
                <Database className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {upstream}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MiniCard
            title="Req/sec"
            value="1.2k"
            icon={<Activity className="h-4 w-4" />}
          />
          <MiniCard
            title="Upstreams"
            value="2 Healthy"
            icon={<Server className="h-4 w-4" />}
          />
          <MiniCard
            title="TLS"
            value="Enabled"
            icon={<ShieldCheck className="h-4 w-4" />}
          />
        </div>
      </div>
    </PanelShell>
  );
}
