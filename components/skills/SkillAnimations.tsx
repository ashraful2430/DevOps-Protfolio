"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
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

function TerminalBox({ lines }: { lines: string[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-2 border-b border-border/70 bg-card/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[11px] text-muted-foreground">
          ashik@devops-machine — pipeline log
        </span>
      </div>

      <div className="h-[210px] overflow-y-auto px-4 py-4 font-mono text-xs leading-6 sm:text-sm">
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
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block h-4 w-2 bg-accent align-middle"
        />
      </div>
    </div>
  );
}

function StatusBadge({ state }: { state: "idle" | "running" | "done" }) {
  const styles =
    state === "done"
      ? "border-accent/30 bg-gradient-to-r from-accent/15 to-emerald-400/10 text-accent shadow-[0_0_18px_rgba(29,158,117,0.14)]"
      : state === "running"
        ? "border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 to-amber-400/10 text-yellow-300 shadow-[0_0_18px_rgba(234,179,8,0.12)]"
        : "border-border bg-card/70 text-muted-foreground";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] sm:px-4 sm:py-2 sm:text-[11px] ${styles}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === "done"
            ? "bg-accent"
            : state === "running"
              ? "bg-yellow-400"
              : "bg-muted-foreground/40"
        }`}
      />
      {state}
    </motion.span>
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
    PIPELINE_STEPS.map(() => "idle")
  );
  const [connectors, setConnectors] = useState<boolean[]>(
    PIPELINE_STEPS.map(() => false)
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
          Math.max(120, Math.floor(step.duration / step.logLines.length))
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
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 bg-background/45 px-4 py-4 sm:px-6">
          <div>
            <p className="text-base font-semibold text-foreground">
              CI/CD Pipeline — how it works
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              GitLab CI + ArgoCD + Kubernetes
            </p>
          </div>

          <AnimatePresence mode="wait">
            {running ? (
              <StatusBadge key="running" state="running" />
            ) : finished ? (
              <StatusBadge key="done" state="done" />
            ) : (
              <StatusBadge key="idle" state="idle" />
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-5 p-4 sm:p-5 md:p-6">
          <div className="rounded-[24px] border border-border/70 bg-gradient-to-b from-card/60 to-background/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-4">
            <div className="md:hidden">
              <div className="mb-4 rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-2xl font-bold leading-tight text-foreground">
                  CI/CD Pipeline — how it works
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  GitLab CI + ArgoCD + Kubernetes
                </p>
              </div>

              {currentStep && (
                <div className="mb-4 rounded-2xl border border-border/70 bg-gradient-to-r from-background/80 to-card/50 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card/80">
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

                  <div className="mt-4">
                    <span
                      className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] ${
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
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {PIPELINE_STEPS.map((step, i) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    status={statuses[i]}
                    onClick={() => handleStepClick(i)}
                  />
                ))}
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center md:gap-0">
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
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
                />
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
                className="hidden rounded-2xl border border-border bg-gradient-to-r from-background/80 to-card/50 px-4 py-3 shadow-sm md:block"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card/80">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {currentStep.label}
                      </p>
                      <p className="mt-0.5 break-words font-mono text-xs leading-5 text-accent">
                        $ {currentStep.command}
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <span
                      className={`inline-flex w-full items-center justify-center rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] sm:w-auto ${
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <TerminalBox lines={logLines} />

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
              className={`group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 sm:px-6 sm:py-3.5 ${
                running
                  ? "cursor-not-allowed bg-gradient-to-r from-accent/80 via-emerald-500/80 to-cyan-500/80"
                  : "bg-gradient-to-r from-accent via-emerald-500 to-cyan-500"
              }`}
            >
              <span className="absolute inset-0 animate-[shine_2.2s_linear_infinite] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-2">
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
                whileHover={{ y: -2, borderColor: "rgba(29,158,117,0.4)" }}
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
      </div>
    </div>
  );
}