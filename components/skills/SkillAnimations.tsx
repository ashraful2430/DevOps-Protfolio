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
      <div className="flex flex-col gap-3 border-b border-border/70 bg-background/45 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        </div>
        <div className="w-full sm:w-auto">{action}</div>
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
  heightClass = "min-h-[120px] max-h-[220px]",
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
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border bg-gradient-to-r from-background/80 to-card/50 px-4 py-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/80">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    {currentStep.label}
                  </p>
                  <p className="mt-1 break-words font-mono text-sm leading-6 text-accent">
                    $ {currentStep.command}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <span
                  className={`inline-flex min-w-[160px] items-center justify-center rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] ${
                    statuses[activeStep!] === "done"
                      ? "border border-accent/30 bg-gradient-to-r from-accent/12 to-emerald-400/10 text-accent shadow-[0_0_14px_rgba(29,158,117,0.12)]"
                      : statuses[activeStep!] === "running"
                        ? "border border-yellow-500/30 bg-gradient-to-r from-yellow-500/12 to-amber-400/10 text-yellow-300 shadow-[0_0_14px_rgba(234,179,8,0.12)]"
                        : "border border-border bg-gradient-to-r from-card/80 to-background/70 text-muted-foreground"
                  }`}
                >
                  {statuses[activeStep!] === "done"
                    ? "Done"
                    : statuses[activeStep!] === "running"
                      ? "Running"
                      : "Idle"}
                </span>
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

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [activeTask, setActiveTask] = useState(-1);
  const [logLines, setLogLines] = useState<string[]>([
    "# Ansible playbook is ready",
    "# Click the button to run automation across nodes",
  ]);

  async function runPlaybook() {
    if (started) return;

    setStarted(true);
    setFinished(false);
    setActiveTask(-1);
    setLogLines([
      "$ ansible-playbook deploy.yml -i inventory.ini",
      "PLAY [all] ********************************************************",
    ]);

    for (let i = 0; i < tasks.length; i++) {
      setActiveTask(i);
      await sleep(800);

      setLogLines((prev) => [
        ...prev,
        "",
        `TASK [${tasks[i]}] ***********************************************`,
        ...hosts.map((host) => `changed: [${host}]`),
      ]);
    }

    await sleep(500);

    setLogLines((prev) => [
      ...prev,
      "",
      "PLAY RECAP ********************************************************",
      "web-01    : ok=4 changed=4 unreachable=0 failed=0",
      "web-02    : ok=4 changed=4 unreachable=0 failed=0",
      "worker-01 : ok=4 changed=4 unreachable=0 failed=0",
      "db-01     : ok=4 changed=4 unreachable=0 failed=0",
      "",
      "✓ Automation completed successfully",
    ]);

    setStarted(false);
    setFinished(true);
  }

  function resetPlaybook() {
    setStarted(false);
    setFinished(false);
    setActiveTask(-1);
    setLogLines([
      "# Ansible playbook is ready",
      "# Click the button to run automation across nodes",
    ]);
  }

  const progress =
    activeTask < 0
      ? 0
      : finished
        ? 100
        : Math.round(((activeTask + 1) / tasks.length) * 100);

  return (
    <PanelShell
      title="Ansible — remote automation flow"
      subtitle="Inventory → Playbook → Tasks executed across nodes"
      action={
        <div className="w-full sm:w-auto">
          <span
            className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] sm:w-auto sm:text-[11px] ${
              started
                ? "border border-yellow-500/30 bg-gradient-to-r from-yellow-500/12 to-amber-400/10 text-yellow-300"
                : finished
                  ? "border border-accent/30 bg-gradient-to-r from-accent/12 to-emerald-400/10 text-accent"
                  : "border border-border bg-gradient-to-r from-card/80 to-background/70 text-muted-foreground"
            }`}
          >
            {started ? "Running" : finished ? "Done" : "Ready"}
          </span>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">Hosts</p>
              <span className="text-xs text-muted-foreground">
                {hosts.length} nodes
              </span>
            </div>

            <div className="space-y-2">
              {hosts.map((host) => (
                <div
                  key={host}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5 sm:px-4"
                >
                  <span className="truncate text-sm text-foreground">
                    {host}
                  </span>
                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                    OK
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Playbook Tasks
              </p>
              <span className="text-xs font-semibold text-accent">
                {progress}%
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task, i) => {
                const isDone = finished || i < activeTask;
                const isActive = i === activeTask && started;

                return (
                  <motion.div
                    key={task}
                    animate={{
                      opacity: isDone || isActive ? 1 : 0.55,
                      scale: isActive ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border px-3 py-3 sm:px-4 ${
                      isActive
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : isDone
                          ? "border-accent/30 bg-accent/10"
                          : "border-border/70 bg-background/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-foreground">{task}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
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

                    <div className="mt-2 h-[4px] w-full overflow-hidden rounded-full bg-border/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDone
                            ? "w-full bg-accent"
                            : isActive
                              ? "w-2/3 bg-yellow-400"
                              : "w-[10%] bg-muted-foreground/30"
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={runPlaybook}
              disabled={started}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto ${
                started
                  ? "cursor-not-allowed bg-accent/60"
                  : "bg-gradient-to-r from-accent to-cyan-500"
              }`}
            >
              {started ? "Running..." : "Run Playbook"}
            </button>

            {(finished || activeTask >= 0) && (
              <button
                onClick={resetPlaybook}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-card sm:w-auto"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Ansible Playbook
            </p>

            <TerminalBox
              title="deploy.yml"
              heightClass="h-[140px] sm:h-[170px] lg:h-[190px]"
              lines={[
                "- hosts: all",
                "  become: true",
                "  tasks:",
                "    - name: Install packages",
                "      apt:",
                "        name: nginx",
                "        state: present",
                "",
                "    - name: Sync config",
                "      template:",
                "        src: nginx.conf.j2",
                "        dest: /etc/nginx/nginx.conf",
                "",
                "    - name: Restart services",
                "      service:",
                "        name: nginx",
                "        state: restarted",
                "",
                "    - name: Health check",
                "      shell: systemctl status nginx",
              ]}
            />
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Playbook Output
            </p>

            <TerminalBox
              lines={logLines}
              title="ashik@ansible-control — playbook output"
              heightClass="h-[160px] sm:h-[200px] lg:h-[220px]"
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function JenkinsAnimation() {
  const stages = [
    {
      key: "checkout",
      label: "Checkout",
      detail: "Pull latest source from repository",
      logs: [
        "$ git clone git@github.com:ashraful2430/portfolio.git",
        "Cloning into 'portfolio'...",
        "Receiving objects: 100%",
        "✓ Repository checkout complete",
      ],
    },
    {
      key: "build",
      label: "Build",
      detail: "Install dependencies and compile app",
      logs: [
        "$ npm ci",
        "Installing dependencies...",
        "$ npm run build",
        "✓ Production build generated",
      ],
    },
    {
      key: "test",
      label: "Test",
      detail: "Run automated test suite",
      logs: [
        "$ npm run test -- --ci",
        "PASS Hero.test.tsx",
        "PASS Skills.test.tsx",
        "✓ All tests passed",
      ],
    },
    {
      key: "package",
      label: "Package",
      detail: "Create artifact for deployment",
      logs: [
        "$ tar -czf release.tar.gz .next public package.json",
        "Compressing application files...",
        "✓ release.tar.gz created",
      ],
    },
    {
      key: "deploy",
      label: "Deploy",
      detail: "Push artifact to target environment",
      logs: [
        "$ ./deploy.sh production",
        "Uploading release artifact...",
        "Restarting service...",
        "✓ Deployment completed",
      ],
    },
  ];

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [logLines, setLogLines] = useState<string[]>([
    "# Jenkins pipeline is ready",
    "# Click the button below to run the job",
  ]);

  async function runJenkinsJob() {
    if (started) return;

    setStarted(true);
    setFinished(false);
    setActiveStage(-1);
    setLogLines([
      "[Jenkins] Started by user Ashraful",
      "[Pipeline] Start of Pipeline",
      "[Pipeline] node",
    ]);

    for (let i = 0; i < stages.length; i++) {
      setActiveStage(i);
      await sleep(750);

      setLogLines((prev) => [
        ...prev,
        "",
        `[Stage] ${stages[i].label}`,
        ...stages[i].logs,
      ]);
    }

    await sleep(500);

    setLogLines((prev) => [
      ...prev,
      "",
      "[Pipeline] End of Pipeline",
      "Finished: SUCCESS",
      "✓ Jenkins job completed successfully",
    ]);

    setStarted(false);
    setFinished(true);
  }

  function resetJenkinsJob() {
    setStarted(false);
    setFinished(false);
    setActiveStage(-1);
    setLogLines([
      "# Jenkins pipeline is ready",
      "# Click the button below to run the job",
    ]);
  }

  const progress =
    activeStage < 0
      ? 0
      : finished
        ? 100
        : Math.round(((activeStage + 1) / stages.length) * 100);

  return (
    <PanelShell
      title="Jenkins — automated pipeline stages"
      subtitle="Checkout → Build → Test → Package → Deploy"
      action={
        <div className="w-full sm:w-auto">
          <span
            className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] sm:w-auto sm:text-[11px] ${
              started
                ? "border border-yellow-500/30 bg-gradient-to-r from-yellow-500/12 to-amber-400/10 text-yellow-300"
                : finished
                  ? "border border-accent/30 bg-gradient-to-r from-accent/12 to-emerald-400/10 text-accent"
                  : "border border-border bg-gradient-to-r from-card/80 to-background/70 text-muted-foreground"
            }`}
          >
            {started ? "Running" : finished ? "Success" : "Ready"}
          </span>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Pipeline Stages
              </p>
              <span className="text-xs font-semibold text-accent">
                {progress}%
              </span>
            </div>

            <div className="space-y-3">
              {stages.map((stage, i) => {
                const isDone = finished || i < activeStage;
                const isActive = i === activeStage && started;

                return (
                  <motion.div
                    key={stage.key}
                    animate={{
                      opacity: isDone || isActive ? 1 : 0.55,
                      scale: isActive ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border px-3 py-3 sm:px-4 ${
                      isActive
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : isDone
                          ? "border-accent/30 bg-accent/10"
                          : "border-border/70 bg-background/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {stage.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stage.detail}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
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
              title="Job Status"
              value={finished ? "Success" : started ? "Running" : "Idle"}
              icon={<Activity className="h-4 w-4" />}
            />
            <MiniCard
              title="Agent"
              value="docker-node"
              icon={<Server className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={runJenkinsJob}
              disabled={started}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto ${
                started
                  ? "cursor-not-allowed bg-accent/60"
                  : "bg-gradient-to-r from-accent to-cyan-500"
              }`}
            >
              {started ? "Running Job..." : "Run Jenkins Job"}
            </button>

            {(finished || activeStage >= 0) && (
              <button
                onClick={resetJenkinsJob}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-card sm:w-auto"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Jenkinsfile
            </p>

            <TerminalBox
              title="Jenkinsfile"
              heightClass="h-[150px] sm:h-[180px] lg:h-[190px]"
              lines={[
                "pipeline {",
                "  agent any",
                "  stages {",
                "    stage('Checkout') { steps { git 'repo-url' } }",
                "    stage('Build') { steps { sh 'npm ci && npm run build' } }",
                "    stage('Test') { steps { sh 'npm run test -- --ci' } }",
                "    stage('Package') { steps { sh 'tar -czf release.tar.gz .next public' } }",
                "    stage('Deploy') { steps { sh './deploy.sh production' } }",
                "  }",
                "}",
              ]}
            />
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Job Output
            </p>

            <TerminalBox
              lines={logLines}
              title="jenkins@pipeline-agent — console output"
              heightClass="h-[170px] sm:h-[220px] lg:h-[250px]"
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function ArgoCDAnimation() {
  const stages = [
    {
      key: "detect",
      label: "Detect Change",
      detail: "ArgoCD detects a new Git commit",
      logs: [
        "[ArgoCD] Watching repository state...",
        "New commit detected on main branch",
        "Application manifest changed",
      ],
    },
    {
      key: "compare",
      label: "Compare State",
      detail: "Desired state compared with cluster",
      logs: [
        "[ArgoCD] Comparing desired and live state",
        "OutOfSync resources found",
        "Preparing sync operation",
      ],
    },
    {
      key: "sync",
      label: "Sync App",
      detail: "Apply manifests to cluster",
      logs: [
        "[ArgoCD] Applying deployment manifests",
        "Service updated successfully",
        "Ingress configuration applied",
      ],
    },
    {
      key: "rollout",
      label: "Rollout",
      detail: "Kubernetes starts rolling update",
      logs: [
        "[Kubernetes] Starting rolling update",
        "New pods are becoming ready",
        "Old replicas terminating gradually",
      ],
    },
    {
      key: "healthy",
      label: "Healthy",
      detail: "Application reaches healthy state",
      logs: [
        "[ArgoCD] Application status: Synced",
        "[ArgoCD] Health status: Healthy",
        "✓ GitOps sync completed successfully",
      ],
    },
  ];

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [logLines, setLogLines] = useState<string[]>([
    "# ArgoCD application is ready",
    "# Click the button to simulate a GitOps sync",
  ]);

  async function runSync() {
    if (started) return;

    setStarted(true);
    setFinished(false);
    setActiveStage(-1);
    setLogLines([
      "$ argocd app sync portfolio-app",
      "TIMESTAMP                  GROUP        KIND           NAMESPACE  NAME",
    ]);

    for (let i = 0; i < stages.length; i++) {
      setActiveStage(i);
      await sleep(850);

      setLogLines((prev) => [
        ...prev,
        "",
        `[Stage] ${stages[i].label}`,
        ...stages[i].logs,
      ]);
    }

    await sleep(400);

    setLogLines((prev) => [
      ...prev,
      "",
      "$ argocd app get portfolio-app",
      "Sync Status: Synced",
      "Health Status: Healthy",
      "✓ Deployment is now fully reconciled",
    ]);

    setStarted(false);
    setFinished(true);
  }

  function resetSync() {
    setStarted(false);
    setFinished(false);
    setActiveStage(-1);
    setLogLines([
      "# ArgoCD application is ready",
      "# Click the button to simulate a GitOps sync",
    ]);
  }

  const progress =
    activeStage < 0
      ? 0
      : finished
        ? 100
        : Math.round(((activeStage + 1) / stages.length) * 100);

  return (
    <PanelShell
      title="ArgoCD — GitOps deployment sync"
      subtitle="Git change → sync → rollout → healthy application state"
      action={
        <div className="w-full sm:w-auto">
          <span
            className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] sm:w-auto sm:text-[11px] ${
              started
                ? "border border-yellow-500/30 bg-gradient-to-r from-yellow-500/12 to-amber-400/10 text-yellow-300"
                : finished
                  ? "border border-accent/30 bg-gradient-to-r from-accent/12 to-emerald-400/10 text-accent"
                  : "border border-border bg-gradient-to-r from-card/80 to-background/70 text-muted-foreground"
            }`}
          >
            {started ? "Syncing" : finished ? "Healthy" : "Ready"}
          </span>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Sync Stages
              </p>
              <span className="text-xs font-semibold text-accent">
                {progress}%
              </span>
            </div>

            <div className="space-y-3">
              {stages.map((stage, i) => {
                const isDone = finished || i < activeStage;
                const isActive = i === activeStage && started;

                return (
                  <motion.div
                    key={stage.key}
                    animate={{
                      opacity: isDone || isActive ? 1 : 0.55,
                      scale: isActive ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border px-3 py-3 sm:px-4 ${
                      isActive
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : isDone
                          ? "border-accent/30 bg-accent/10"
                          : "border-border/70 bg-background/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {stage.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stage.detail}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isActive
                            ? "bg-yellow-500/15 text-yellow-300"
                            : isDone
                              ? "bg-accent/15 text-accent"
                              : "bg-card text-muted-foreground"
                        }`}
                      >
                        {isActive ? "Syncing" : isDone ? "Done" : "Pending"}
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
              title="Sync Status"
              value={finished ? "Synced" : started ? "OutOfSync" : "Idle"}
              icon={<GitBranch className="h-4 w-4" />}
            />
            <MiniCard
              title="Health"
              value={finished ? "Healthy" : started ? "Progressing" : "Unknown"}
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={runSync}
              disabled={started}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto ${
                started
                  ? "cursor-not-allowed bg-accent/60"
                  : "bg-gradient-to-r from-accent to-cyan-500"
              }`}
            >
              {started ? "Syncing..." : "Run ArgoCD Sync"}
            </button>

            {(finished || activeStage >= 0) && (
              <button
                onClick={resetSync}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-card sm:w-auto"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Application Manifest
            </p>

            <TerminalBox
              title="application.yaml"
              heightClass="h-[150px] sm:h-[180px] lg:h-[190px]"
              lines={[
                "apiVersion: argoproj.io/v1alpha1",
                "kind: Application",
                "metadata:",
                "  name: portfolio-app",
                "spec:",
                "  source:",
                "    repoURL: git@github.com:ashraful2430/portfolio.git",
                "    path: k8s/",
                "  destination:",
                "    namespace: production",
                "    server: https://kubernetes.default.svc",
                "  syncPolicy:",
                "    automated: {}",
              ]}
            />
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Sync Output
            </p>

            <TerminalBox
              lines={logLines}
              title="argocd@control-plane — sync output"
              heightClass="h-[170px] sm:h-[220px] lg:h-[250px]"
            />
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

export function GrafanaAnimation() {
  const panels = [
    { key: "cpu", title: "CPU Usage", value: "42%", trend: "up" },
    { key: "memory", title: "Memory", value: "68%", trend: "stable" },
    { key: "requests", title: "Req / sec", value: "1.8k", trend: "up" },
    { key: "latency", title: "Latency", value: "84ms", trend: "down" },
  ];

  const [activePanel, setActivePanel] = useState(0);
  const [liveMode, setLiveMode] = useState(false);

  useEffect(() => {
    if (!liveMode) return;
    const t = setInterval(() => {
      setActivePanel((p) => (p + 1) % panels.length);
    }, 1400);
    return () => clearInterval(t);
  }, [liveMode, panels.length]);

  const chartBars =
    activePanel === 0
      ? [35, 48, 44, 58, 62, 55, 68, 42]
      : activePanel === 1
        ? [50, 58, 63, 66, 64, 70, 68, 72]
        : activePanel === 2
          ? [20, 35, 40, 52, 61, 74, 66, 80]
          : [70, 62, 58, 49, 44, 39, 36, 30];

  const statusTone = activePanel === 3 ? "warning" : "success";

  return (
    <PanelShell
      title="Grafana — dashboards & observability"
      subtitle="Metrics panels, alert visibility, and system health in one view"
      action={
        <div className="w-full sm:w-auto">
          <span
            className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] sm:w-auto sm:text-[11px] ${
              liveMode
                ? "border border-accent/30 bg-gradient-to-r from-accent/12 to-emerald-400/10 text-accent"
                : "border border-border bg-gradient-to-r from-card/80 to-background/70 text-muted-foreground"
            }`}
          >
            {liveMode ? "Live View" : "Dashboard"}
          </span>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {panels.map((panel, i) => {
              const isActive = i === activePanel;
              return (
                <button
                  key={panel.key}
                  onClick={() => setActivePanel(i)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-accent/35 bg-accent/10 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                      : "border-border/70 bg-card/60 hover:border-accent/20"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">{panel.title}</p>
                  <p className="mt-2 text-xl font-bold text-foreground">
                    {panel.value}
                  </p>
                  <p
                    className={`mt-2 text-[11px] font-semibold uppercase ${
                      panel.trend === "up"
                        ? "text-accent"
                        : panel.trend === "down"
                          ? "text-yellow-300"
                          : "text-muted-foreground"
                    }`}
                  >
                    {panel.trend}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Active Panel
              </p>
              <StatusBadge
                label={statusTone === "success" ? "Healthy" : "Watch"}
                tone={statusTone}
              />
            </div>

            <div className="flex h-52 items-end gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
              {chartBars.map((bar, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${bar}%` }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className={`w-full rounded-t-xl ${
                    activePanel === 3
                      ? "bg-gradient-to-t from-yellow-500 to-amber-300"
                      : "bg-gradient-to-t from-accent via-emerald-400 to-cyan-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setLiveMode((p) => !p)}
              className="w-full rounded-xl bg-gradient-to-r from-accent to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto"
            >
              {liveMode ? "Stop Live Mode" : "Start Live Mode"}
            </button>

            <button
              onClick={() => {
                setLiveMode(false);
                setActivePanel(0);
              }}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-card sm:w-auto"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Dashboard Summary
            </p>

            <div className="grid grid-cols-2 gap-3">
              <MiniCard
                title="Dashboards"
                value="12"
                icon={<Layers3 className="h-4 w-4" />}
              />
              <MiniCard
                title="Alerts"
                value={activePanel === 3 ? "3 Active" : "1 Active"}
                icon={<ShieldCheck className="h-4 w-4" />}
              />
              <MiniCard
                title="Data Source"
                value="Prometheus"
                icon={<Database className="h-4 w-4" />}
              />
              <MiniCard
                title="Refresh"
                value={liveMode ? "Live" : "10s"}
                icon={<Activity className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Panel Notes
            </p>

            <TerminalBox
              title="grafana@dashboard"
              heightClass="h-[170px] sm:h-[210px] lg:h-[240px]"
              lines={[
                `$ panel: ${panels[activePanel].title}`,
                `value: ${panels[activePanel].value}`,
                `trend: ${panels[activePanel].trend}`,
                "",
                liveMode ? "live mode: enabled" : "live mode: disabled",
                "datasource: prometheus",
                "dashboard: production-observability",
                activePanel === 3
                  ? "note: latency spike detected, review upstreams"
                  : "note: metrics within expected operating range",
              ]}
            />
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

export function GithubAnimation() {
  const steps = [
    "Create feature branch",
    "Commit changes",
    "Push to remote",
    "Open pull request",
    "Code review approved",
    "Merge to main",
  ];

  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "# GitHub workflow ready",
    "# Click below to simulate collaboration flow",
  ]);

  async function runFlow() {
    if (running) return;
    setRunning(true);
    setDone(false);
    setActive(-1);
    setLogs([
      "$ git checkout -b feature/portfolio-update",
      "$ git add . && git commit -m 'improve portfolio skills section'",
    ]);

    for (let i = 0; i < steps.length; i++) {
      setActive(i);
      await sleep(700);
      setLogs((prev) => [...prev, "", `✓ ${steps[i]}`]);
    }

    setLogs((prev) => [
      ...prev,
      "",
      "✓ Pull request merged successfully",
      "✓ Main branch updated",
    ]);
    setRunning(false);
    setDone(true);
  }

  function resetFlow() {
    setActive(-1);
    setRunning(false);
    setDone(false);
    setLogs([
      "# GitHub workflow ready",
      "# Click below to simulate collaboration flow",
    ]);
  }

  return (
    <PanelShell
      title="GitHub — repository collaboration flow"
      subtitle="Commits, pull requests, reviews, and merge workflow"
      action={
        <StatusBadge
          label={running ? "Running" : done ? "Merged" : "Ready"}
          tone={running ? "warning" : done ? "success" : "default"}
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <p className="mb-4 text-sm font-semibold text-foreground">
              Workflow Steps
            </p>
            <div className="space-y-3">
              {steps.map((step, i) => {
                const isDone = done || i < active;
                const isActive = running && i === active;
                return (
                  <div
                    key={step}
                    className={`rounded-xl border px-4 py-3 ${
                      isActive
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : isDone
                          ? "border-accent/30 bg-accent/10"
                          : "border-border/70 bg-background/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-foreground">{step}</span>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {isActive ? "Running" : isDone ? "Done" : "Pending"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <TinyProgress value={isDone ? 100 : isActive ? 60 : 8} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={runFlow}
              disabled={running}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white sm:w-auto ${
                running
                  ? "cursor-not-allowed bg-accent/60"
                  : "bg-gradient-to-r from-accent to-cyan-500"
              }`}
            >
              {running ? "Running..." : "Run GitHub Flow"}
            </button>
            {(done || active >= 0) && (
              <button
                onClick={resetFlow}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground sm:w-auto"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <TerminalBox
          lines={logs}
          title="github@repo — collaboration log"
          heightClass="h-[300px] sm:h-[300px] lg:h-[500px]"
        />
      </div>
    </PanelShell>
  );
}

export function PostgreSQLAnimation() {
  const queries = [
    "SELECT * FROM users LIMIT 10;",
    "CREATE INDEX idx_email ON users(email);",
    "BEGIN; UPDATE orders SET status='paid' WHERE id=101; COMMIT;",
    "EXPLAIN ANALYZE SELECT * FROM enrollments WHERE user_id = 5;",
  ];

  const [selected, setSelected] = useState(0);

  const outputs = [
    [
      " id | name  | email",
      "----+-------+--------------------",
      " 1  | Ashik | ashik@mail.com",
      " 2  | Rahim | rahim@mail.com",
      " 3  | Karim | karim@mail.com",
    ],
    ["CREATE INDEX", "✓ idx_email created successfully"],
    ["BEGIN", "UPDATE 1", "COMMIT", "✓ Transaction completed"],
    [
      "Seq Scan on enrollments ...",
      "Execution Time: 3.12 ms",
      "✓ Query analyzed",
    ],
  ];

  return (
    <PanelShell
      title="PostgreSQL — relational database operations"
      subtitle="Structured data, SQL queries, indexing, and transactions"
      action={<StatusBadge label="SQL" tone="success" />}
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {queries.map((query, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${
                selected === i
                  ? "border-accent/30 bg-accent/10"
                  : "border-border/70 bg-card/60"
              }`}
            >
              <p className="font-mono text-xs text-foreground">{query}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <TerminalBox
            title="psql@postgres"
            heightClass="h-[190px] sm:h-[230px]"
            lines={[
              `postgres=# ${queries[selected]}`,
              "",
              ...outputs[selected],
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <MiniCard
              title="Tables"
              value="24"
              icon={<Database className="h-4 w-4" />}
            />
            <MiniCard
              title="Indexes"
              value="16"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function MongoDBAnimation() {
  const operations = [
    {
      title: "Find Documents",
      query: 'db.users.find({ role: "student" })',
      result: [
        '{ name: "Ashik", role: "student" }',
        '{ name: "Rahim", role: "student" }',
      ],
    },
    {
      title: "Insert Document",
      query: 'db.orders.insertOne({ user: "Ashik", total: 1500 })',
      result: ["acknowledged: true", 'insertedId: ObjectId("65ab12...")'],
    },
    {
      title: "Update Document",
      query:
        'db.users.updateOne({ name: "Ashik" }, { $set: { active: true } })',
      result: ["matchedCount: 1", "modifiedCount: 1"],
    },
    {
      title: "Aggregation",
      query:
        'db.orders.aggregate([{ $group: { _id: "$status", total: { $sum: 1 } } }])',
      result: ['{ _id: "paid", total: 12 }', '{ _id: "pending", total: 4 }'],
    },
  ];

  const [selected, setSelected] = useState(0);

  return (
    <PanelShell
      title="MongoDB — document database flow"
      subtitle="Collections, documents, flexible schema, and query pipeline"
      action={<StatusBadge label="NoSQL" tone="success" />}
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {operations.map((op, i) => (
            <button
              key={op.title}
              onClick={() => setSelected(i)}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${
                selected === i
                  ? "border-accent/30 bg-accent/10"
                  : "border-border/70 bg-card/60"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">
                {op.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Interactive document operation
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <TerminalBox
            title="mongo@shell"
            heightClass="h-[190px] sm:h-[230px]"
            lines={[
              `> ${operations[selected].query}`,
              "",
              ...operations[selected].result,
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <MiniCard
              title="Collections"
              value="18"
              icon={<Database className="h-4 w-4" />}
            />
            <MiniCard
              title="Documents"
              value="12.4k"
              icon={<Activity className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function VPCAnimation() {
  const zones = [
    { name: "Public Subnet", status: "Active" },
    { name: "Private App Subnet", status: "Active" },
    { name: "Private DB Subnet", status: "Protected" },
  ];

  return (
    <PanelShell
      title="VPC — cloud network architecture"
      subtitle="Subnets, routing, gateways, and secure private/public segmentation"
      action={<StatusBadge label="Network" tone="success" />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          <p className="mb-4 text-sm font-semibold text-foreground">
            VPC Layout
          </p>
          <div className="space-y-3">
            {zones.map((zone) => (
              <div
                key={zone.name}
                className="rounded-xl border border-border/70 bg-background/60 px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {zone.name}
                  </span>
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase text-accent">
                    {zone.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TerminalBox
          title="vpc@network-view"
          heightClass="h-[170px] sm:h-[210px]"
          lines={[
            "VPC CIDR: 10.0.0.0/16",
            "Internet Gateway attached",
            "Route table configured",
            "Public subnet routes → IGW",
            "Private subnet routes → NAT Gateway",
            "✓ Network segmentation applied",
          ]}
        />
      </div>
    </PanelShell>
  );
}

export function EC2Animation() {
  const [state, setState] = useState<"Stopped" | "Pending" | "Running">(
    "Stopped",
  );

  async function startInstance() {
    if (state !== "Stopped") return;
    setState("Pending");
    await sleep(1200);
    setState("Running");
  }

  function resetInstance() {
    setState("Stopped");
  }

  return (
    <PanelShell
      title="EC2 — compute instance lifecycle"
      subtitle="Launch, configure, monitor, and serve workloads on virtual machines"
      action={
        <StatusBadge
          label={state}
          tone={
            state === "Running"
              ? "success"
              : state === "Pending"
                ? "warning"
                : "default"
          }
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <MiniCard
            title="Instance Type"
            value="t3.medium"
            icon={<Server className="h-4 w-4" />}
          />
          <MiniCard
            title="AMI"
            value="Ubuntu 22.04"
            icon={<Layers3 className="h-4 w-4" />}
          />
          <MiniCard
            title="Public IP"
            value={state === "Running" ? "18.12.44.91" : "--"}
            icon={<Globe className="h-4 w-4" />}
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={startInstance}
              disabled={state !== "Stopped"}
              className="w-full rounded-xl bg-gradient-to-r from-accent to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
            >
              {state === "Stopped"
                ? "Start Instance"
                : state === "Pending"
                  ? "Starting..."
                  : "Running"}
            </button>
            <button
              onClick={resetInstance}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground sm:w-auto"
            >
              Reset
            </button>
          </div>
        </div>

        <TerminalBox
          title="ec2@instance-console"
          heightClass="h-[170px] sm:h-[210px]"
          lines={[
            "$ systemctl status nginx",
            state === "Stopped"
              ? "Instance is offline"
              : state === "Pending"
                ? "Boot sequence in progress..."
                : "nginx.service active (running)",
            "",
            "$ top",
            state === "Running" ? "CPU: 12% | MEM: 48%" : "--",
            "",
            state === "Running"
              ? "✓ App server reachable"
              : "Waiting for instance health checks...",
          ]}
        />
      </div>
    </PanelShell>
  );
}

export function RDSAnimation() {
  const [selected, setSelected] = useState(0);
  const tabs = ["Provision", "Connect", "Backup", "Monitor"];

  return (
    <PanelShell
      title="RDS — managed database workflow"
      subtitle="Provision, connect, backup, and monitor managed relational databases"
      action={<StatusBadge label="Managed DB" tone="success" />}
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setSelected(i)}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${
                selected === i
                  ? "border-accent/30 bg-accent/10"
                  : "border-border/70 bg-card/60"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{tab}</p>
            </button>
          ))}
        </div>

        <TerminalBox
          title="rds@database"
          heightClass="h-[180px] sm:h-[220px]"
          lines={
            selected === 0
              ? [
                  "Creating db.t3.micro instance...",
                  "Allocating storage...",
                  "Configuring subnet group...",
                  "✓ RDS instance available",
                ]
              : selected === 1
                ? [
                    "Host: mydb.xxxxxx.rds.amazonaws.com",
                    "Port: 5432",
                    "SSL: enabled",
                    "✓ Connection successful",
                  ]
                : selected === 2
                  ? [
                      "Backup window: 03:00 UTC",
                      "Snapshot started...",
                      "Snapshot completed",
                      "✓ Automated backup healthy",
                    ]
                  : [
                      "CPU: 18%",
                      "Connections: 42",
                      "Replica lag: 0 ms",
                      "✓ Metrics normal",
                    ]
          }
        />
      </div>
    </PanelShell>
  );
}

export function S3Animation() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <PanelShell
      title="S3 — object storage operations"
      subtitle="Store, retrieve, and manage files with scalable cloud storage"
      action={
        <StatusBadge
          label={uploaded ? "Stored" : "Bucket Ready"}
          tone="success"
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <p className="text-sm font-semibold text-foreground">Bucket</p>
            <p className="mt-2 text-xs text-muted-foreground">
              portfolio-assets-prod
            </p>
            <div className="mt-4">
              <TinyProgress value={uploaded ? 100 : 18} />
            </div>
          </div>

          <button
            onClick={() => setUploaded((p) => !p)}
            className="rounded-xl bg-gradient-to-r from-accent to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            {uploaded ? "Reset Upload" : "Upload File"}
          </button>
        </div>

        <TerminalBox
          title="s3@bucket"
          heightClass="h-[170px] sm:h-[210px]"
          lines={[
            "$ aws s3 cp build.zip s3://portfolio-assets-prod/",
            uploaded
              ? "upload: ./build.zip to s3://portfolio-assets-prod/build.zip"
              : "waiting for upload...",
            "",
            uploaded
              ? "✓ object stored successfully"
              : "bucket policy validated",
            uploaded ? "ACL: private" : "versioning enabled",
          ]}
        />
      </div>
    </PanelShell>
  );
}

export function IAMAnimation() {
  const roles = ["Developer", "DevOpsAdmin", "ReadOnlyAuditor"];
  const [selected, setSelected] = useState(1);

  return (
    <PanelShell
      title="IAM — access control and permissions"
      subtitle="Users, roles, policies, and least-privilege access flow"
      action={<StatusBadge label="Secured" tone="success" />}
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {roles.map((role, i) => (
            <button
              key={role}
              onClick={() => setSelected(i)}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${
                selected === i
                  ? "border-accent/30 bg-accent/10"
                  : "border-border/70 bg-card/60"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{role}</p>
            </button>
          ))}
        </div>

        <TerminalBox
          title="iam@policy-view"
          heightClass="h-[180px] sm:h-[220px]"
          lines={
            selected === 0
              ? [
                  "Role: Developer",
                  "Permissions: ECS read, S3 read/write limited",
                  "Policy: least privilege",
                  "✓ Safe developer access",
                ]
              : selected === 1
                ? [
                    "Role: DevOpsAdmin",
                    "Permissions: EC2, ECS, IAM pass role, CloudWatch",
                    "MFA: required",
                    "✓ Elevated operational access",
                  ]
                : [
                    "Role: ReadOnlyAuditor",
                    "Permissions: CloudTrail read, Config read",
                    "No write actions allowed",
                    "✓ Audit-safe access",
                  ]
          }
        />
      </div>
    </PanelShell>
  );
}

export function BashAnimation() {
  const scripts = ["backup.sh", "deploy.sh", "health-check.sh", "cleanup.sh"];
  const [selected, setSelected] = useState(0);

  const outputs = [
    [
      "#!/bin/bash",
      "tar -czf backup.tar.gz /var/www/app",
      "aws s3 cp backup.tar.gz s3://backups/",
      "✓ Backup completed",
    ],
    [
      "#!/bin/bash",
      "git pull origin main",
      "docker compose up -d --build",
      "✓ Deployment completed",
    ],
    [
      "#!/bin/bash",
      "curl -f http://localhost:3000/status",
      "echo 'app healthy'",
      "✓ Health check passed",
    ],
    [
      "#!/bin/bash",
      "docker image prune -af",
      "rm -rf /tmp/build-cache",
      "✓ Cleanup completed",
    ],
  ];

  return (
    <PanelShell
      title="Bash/Shell — automation scripting"
      subtitle="Command chaining, scripting, environment control, and task automation"
      action={<StatusBadge label="Shell" tone="success" />}
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {scripts.map((script, i) => (
            <button
              key={script}
              onClick={() => setSelected(i)}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${
                selected === i
                  ? "border-accent/30 bg-accent/10"
                  : "border-border/70 bg-card/60"
              }`}
            >
              <p className="font-mono text-sm text-foreground">{script}</p>
            </button>
          ))}
        </div>

        <TerminalBox
          title="bash@shell"
          heightClass="h-[190px] sm:h-[230px]"
          lines={outputs[selected]}
        />
      </div>
    </PanelShell>
  );
}

export function HelmAnimation() {
  const steps = [
    {
      key: "chart",
      label: "Load Chart",
      detail: "Read Helm chart structure and metadata",
      logs: [
        "$ helm lint portfolio-chart",
        "==> Linting portfolio-chart",
        "1 chart(s) linted, 0 chart(s) failed",
      ],
    },
    {
      key: "values",
      label: "Apply Values",
      detail: "Inject environment-specific values",
      logs: [
        "$ helm template portfolio ./chart -f values-prod.yaml",
        "Using values from values-prod.yaml",
        "Rendering templates with production values",
      ],
    },
    {
      key: "render",
      label: "Render Templates",
      detail: "Generate Kubernetes manifests",
      logs: [
        "deployment.yaml rendered",
        "service.yaml rendered",
        "ingress.yaml rendered",
      ],
    },
    {
      key: "install",
      label: "Install Release",
      detail: "Create or update Helm release",
      logs: [
        "$ helm upgrade --install portfolio ./chart -n production",
        "Release 'portfolio' has been upgraded",
        "NAME: portfolio",
      ],
    },
    {
      key: "verify",
      label: "Verify Release",
      detail: "Confirm rollout and release health",
      logs: [
        "$ helm list -n production",
        "portfolio   deployed   1.2.0",
        "✓ Release healthy and deployed",
      ],
    },
  ];

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [logLines, setLogLines] = useState<string[]>([
    "# Helm chart is ready",
    "# Click below to simulate a production release",
  ]);

  async function runHelmRelease() {
    if (started) return;

    setStarted(true);
    setFinished(false);
    setActiveStep(-1);
    setLogLines([
      "$ helm repo update",
      "Hang tight while we grab the latest from your chart repositories...",
      "Update Complete.",
    ]);

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      await sleep(750);

      setLogLines((prev) => [
        ...prev,
        "",
        `[Step] ${steps[i].label}`,
        ...steps[i].logs,
      ]);
    }

    setLogLines((prev) => [
      ...prev,
      "",
      "$ kubectl get pods -n production",
      "portfolio-7db9d7f8c9-2xk9m   Running",
      "portfolio-7db9d7f8c9-bn7pd   Running",
      "✓ Helm release completed successfully",
    ]);

    setStarted(false);
    setFinished(true);
  }

  function resetHelmRelease() {
    setStarted(false);
    setFinished(false);
    setActiveStep(-1);
    setLogLines([
      "# Helm chart is ready",
      "# Click below to simulate a production release",
    ]);
  }

  const progress =
    activeStep < 0
      ? 0
      : finished
        ? 100
        : Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <PanelShell
      title="Helm — Kubernetes package management"
      subtitle="Chart values, template rendering, release install and upgrade flow"
      action={
        <StatusBadge
          label={started ? "Deploying" : finished ? "Released" : "Ready"}
          tone={started ? "warning" : finished ? "success" : "default"}
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Release Steps
              </p>
              <span className="text-xs font-semibold text-accent">
                {progress}%
              </span>
            </div>

            <div className="space-y-3">
              {steps.map((step, i) => {
                const isDone = finished || i < activeStep;
                const isActive = i === activeStep && started;

                return (
                  <motion.div
                    key={step.key}
                    animate={{
                      opacity: isDone || isActive ? 1 : 0.55,
                      scale: isActive ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border px-3 py-3 sm:px-4 ${
                      isActive
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : isDone
                          ? "border-accent/30 bg-accent/10"
                          : "border-border/70 bg-background/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {step.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {step.detail}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
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
              title="Release"
              value={finished ? "portfolio" : "Pending"}
              icon={<Layers3 className="h-4 w-4" />}
            />
            <MiniCard
              title="Namespace"
              value="production"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={runHelmRelease}
              disabled={started}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto ${
                started
                  ? "cursor-not-allowed bg-accent/60"
                  : "bg-gradient-to-r from-accent to-cyan-500"
              }`}
            >
              {started ? "Deploying..." : "Run Helm Release"}
            </button>

            {(finished || activeStep >= 0) && (
              <button
                onClick={resetHelmRelease}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-card sm:w-auto"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              values-prod.yaml
            </p>

            <TerminalBox
              title="values-prod.yaml"
              heightClass="h-[150px] sm:h-[180px] lg:h-[190px]"
              lines={[
                "replicaCount: 2",
                "image:",
                "  repository: portfolio-app",
                "  tag: 1.2.0",
                "service:",
                "  type: ClusterIP",
                "ingress:",
                "  enabled: true",
                "resources:",
                "  limits:",
                "    cpu: 500m",
                "    memory: 512Mi",
              ]}
            />
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Helm Output
            </p>

            <TerminalBox
              lines={logLines}
              title="helm@release-manager"
              heightClass="h-[170px] sm:h-[220px] lg:h-[250px]"
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
