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
    <div className="overflow-hidden rounded-2xl border border-border bg-background/70 shadow-inner">
      <div className="flex items-center gap-2 border-b border-border bg-card/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[11px] text-muted-foreground">
          ashik@devops-machine — pipeline log
        </span>
      </div>

      <div className="h-[220px] overflow-y-auto px-4 py-4 font-mono text-xs leading-6 sm:text-sm">
        {lines.map((line, index) => (
          <motion.p
            key={`${line}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
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

function StepNode({
  step,
  status,
  isLast,
  connectorLit,
  onClick,
}: {
  step: PipelineStep;
  status: StepStatus;
  isLast: boolean;
  connectorLit: boolean;
  onClick: () => void;
}) {
  const isDone = status === "done";
  const isRunning = status === "running";

  return (
    <div className="flex min-w-0 flex-1 items-center">
      <motion.button
        onClick={onClick}
        whileHover={{ y: -3, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex h-[110px] min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-2xl px-3 transition-all duration-300 ${
          isDone
            ? "bg-gradient-to-b from-accent/12 to-accent/5 text-accent"
            : isRunning
              ? "bg-gradient-to-b from-yellow-500/12 to-yellow-500/5 text-yellow-400"
              : "bg-card/40 text-muted-foreground hover:bg-card/60"
        }`}
      >
        {isRunning && (
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-yellow-500/5"
          />
        )}

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${
            isDone
              ? "bg-accent/12"
              : isRunning
                ? "bg-yellow-500/10"
                : "bg-background/60"
          }`}
        >
          {isDone ? "✓" : step.icon}
        </div>

        <span
          className={`text-center text-[12px] font-semibold leading-4 ${
            isDone
              ? "text-accent"
              : isRunning
                ? "text-yellow-400"
                : "text-muted-foreground"
          }`}
        >
          {step.label}
        </span>

        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isDone ? "bg-accent" : isRunning ? "bg-yellow-400 animate-pulse" : "bg-border"
          }`}
        />
      </motion.button>

      {!isLast && (
        <div className="mx-1 flex w-10 shrink-0 items-center justify-center xl:w-14">
          <div className="relative h-6 w-full">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-border/40" />

            {connectorLit && (
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 origin-left rounded-full bg-accent"
              />
            )}

            <motion.div
              animate={{
                opacity: connectorLit ? 1 : 0.2,
                x: connectorLit ? [0, 5, 0] : 0,
              }}
              transition={
                connectorLit
                  ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
              className={`absolute right-0 top-1/2 -translate-y-1/2 text-sm ${
                connectorLit ? "text-accent" : "text-muted-foreground"
              }`}
            >
              →
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CICDAnimation() {
  const [statuses, setStatuses] = useState<StepStatus[]>(PIPELINE_STEPS.map(() => "idle"));
  const [connectors, setConnectors] = useState<boolean[]>(PIPELINE_STEPS.map(() => false));
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
        await sleep(Math.max(120, Math.floor(step.duration / step.logLines.length)));
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
        <div className="flex items-center justify-between gap-4 border-b border-border bg-background/45 px-6 py-4">
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
              <motion.span
                key="running"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400"
              >
                <motion.span
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-yellow-400"
                />
                Running
              </motion.span>
            ) : finished ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Done
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                Idle
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="w-full px-1">
            <div className="flex w-full items-stretch">
              {PIPELINE_STEPS.map((step, i) => (
                <StepNode
                  key={step.id}
                  step={step}
                  status={statuses[i]}
                  isLast={i === PIPELINE_STEPS.length - 1}
                  connectorLit={connectors[i]}
                  onClick={() => handleStepClick(i)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="min-w-[56px] text-xs text-muted-foreground">Progress</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/60">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-full rounded-full bg-accent"
              />
            </div>
            <span className="min-w-[36px] text-right text-xs font-semibold text-accent">
              {progress}%
            </span>
          </div>

          <AnimatePresence mode="wait">
            {currentStep && (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-to-r from-background/80 to-card/50 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card/80">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{currentStep.label}</p>
                    <p className="mt-0.5 font-mono text-xs text-accent">
                      $ {currentStep.command}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    statuses[activeStep!] === "done"
                      ? "border border-accent/30 bg-accent/10 text-accent"
                      : statuses[activeStep!] === "running"
                        ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                        : "border border-border bg-card/70 text-muted-foreground"
                  }`}
                >
                  {statuses[activeStep!] === "done"
                    ? "Done"
                    : statuses[activeStep!] === "running"
                      ? "Running"
                      : "Idle"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <TerminalBox lines={logLines} />

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ opacity: 0.88 }}
              whileTap={{ scale: 0.97 }}
              onClick={runPipeline}
              disabled={running}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${
                running
                  ? "cursor-not-allowed bg-accent/50"
                  : "bg-accent hover:shadow-[0_0_20px_rgba(29,158,117,0.3)]"
              }`}
            >
              {running ? "⟳ Running…" : "▶ Run Pipeline"}
            </motion.button>

            {(finished || doneCount > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.97 }}
                onClick={reset}
                className="rounded-xl border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-border/80"
              >
                ↺ Reset
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
                <span>Deployment complete · 3/3 pods running · zero downtime rollout</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}