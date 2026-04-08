"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  Boxes,
  Cloud,
  Box,
  GitBranch,
  HardDrive,
  RefreshCcw,
  Server,
  TerminalSquare,
  Wrench,
  Settings2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function TerminalBox({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-background/70 shadow-inner ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border bg-card/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[11px] text-muted-foreground">
          ashik@devops-machine — pipeline log
        </span>
      </div>

      <div className="h-[260px] overflow-y-auto px-4 py-4 font-mono text-xs leading-6 sm:text-sm">
        <AnimatePresence initial={false}>
          {lines.map((line, index) => (
            <motion.p
              key={`${line}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22 }}
              className={
                line.startsWith("✓")
                  ? "text-accent"
                  : line.startsWith("$")
                  ? "text-foreground"
                  : line.startsWith("PASS")
                  ? "text-accent"
                  : line.includes("failed")
                  ? "text-red-500 dark:text-red-400"
                  : "text-muted-foreground"
              }
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </AnimatePresence>

        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block h-4 w-2 bg-accent align-middle"
        />
      </div>
    </div>
  );
}

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
    duration: 600,
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
    command: "npm run test",
    duration: 800,
    logLines: [
      "$ npm run test -- --ci",
      "PASS  src/components/Hero.test.tsx",
      "PASS  src/components/Skills.test.tsx",
      "PASS  src/lib/data.test.ts",
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
    duration: 700,
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
    duration: 800,
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
    duration: 900,
    logLines: [
      "$ kubectl rollout status deployment/my-app",
      'Waiting for "my-app" to roll out...',
      "✓ Pod my-app-7d9f8b-xkj2p: Running",
      "✓ Pod my-app-7d9f8b-mn3qr: Running",
      "✓ Deployment complete · 3/3 pods ready",
    ],
  },
];

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
  const isFailed = status === "failed";

  return (
    <div className="flex min-w-0 flex-1 items-start">
      <div className="flex w-full flex-col items-center gap-2">
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-base transition sm:h-14 sm:w-14 ${
            isDone
              ? "border-accent bg-accent/10 text-accent"
              : isRunning
              ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-500"
              : isFailed
              ? "border-red-500/50 bg-red-500/10 text-red-500"
              : "border-border bg-card/80 text-muted-foreground"
          }`}
        >
          {isRunning && (
            <motion.div
              animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-[-4px] rounded-[14px] border border-yellow-500/50"
            />
          )}

          {isDone ? <span className="font-semibold">✓</span> : <span>{step.icon}</span>}
        </motion.button>

        <span
          className={`text-center text-[10px] font-medium leading-4 sm:text-[11px] ${
            isDone
              ? "text-accent"
              : isRunning
              ? "text-yellow-500"
              : isFailed
              ? "text-red-500"
              : "text-muted-foreground"
          }`}
        >
          {step.label}
        </span>
      </div>

      {!isLast && (
        <div className="relative mx-2 mt-6 hidden h-0.5 flex-1 overflow-hidden rounded-full bg-border lg:block">
          <AnimatePresence>
            {connectorLit && (
              <motion.div
                key="connector"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 origin-left rounded-full bg-accent"
              />
            )}
          </AnimatePresence>
        </div>
      )}
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
  const [logLines, setLogLines] = useState<{ text: string; stepId: string }[]>([]);
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  function handleStepClick(idx: number) {
    if (statuses[idx] === "idle" && !running && !finished) return;
    setActiveStep(idx);
  }

  function reset() {
    setStatuses(PIPELINE_STEPS.map(() => "idle"));
    setConnectors(PIPELINE_STEPS.map(() => false));
    setLogLines([]);
    setRunning(false);
    setActiveStep(null);
    setFinished(false);
  }

  async function runPipeline() {
    if (running) return;

    reset();
    await new Promise((r) => setTimeout(r, 50));
    setRunning(true);

    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      const step = PIPELINE_STEPS[i];

      setStatuses((prev) => {
        const next = [...prev];
        next[i] = "running";
        return next;
      });

      setActiveStep(i);

      for (let l = 0; l < step.logLines.length; l++) {
        await new Promise((r) => setTimeout(r, step.duration / step.logLines.length));
        setLogLines((prev) => [...prev, { text: step.logLines[l], stepId: step.id }]);
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

  const doneCount = statuses.filter((s) => s === "done").length;
  const progress = Math.round((doneCount / PIPELINE_STEPS.length) * 100);
  const currentStep = activeStep !== null ? PIPELINE_STEPS[activeStep] : null;

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 border-b border-border bg-background/45 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-base font-semibold text-foreground">
              CI/CD Pipeline — how it works
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              GitLab CI + ArgoCD + Kubernetes
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-gradient-to-r from-accent/12 to-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent shadow-[0_0_20px_rgba(29,158,117,0.08)]">
              Done
            </span>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="overflow-x-auto">
            <div className="flex min-w-[820px] items-start">
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
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-full rounded-full bg-accent"
              />
            </div>
            <span className="min-w-[34px] text-xs font-medium text-accent">{progress}%</span>
          </div>

          <AnimatePresence mode="wait">
            {currentStep && (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-background/60 px-4 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/80 text-foreground">
                    <Settings2 className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {currentStep.label}
                    </div>
                    <div className="mt-1 font-mono text-xs text-accent">
                      $ {currentStep.command}
                    </div>
                  </div>
                </div>

                <div className="sm:ml-auto">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      statuses[activeStep!] === "done"
                        ? "border border-accent/30 bg-accent/10 text-accent"
                        : statuses[activeStep!] === "running"
                        ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                        : "border border-border bg-card/70 text-muted-foreground"
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

          <TerminalBox lines={logLines.map((item) => item.text)} />

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              onClick={runPipeline}
              disabled={running}
              className={`rounded-xl px-5 py-3 text-sm font-semibold text-white ${
                running ? "cursor-not-allowed bg-accent/60" : "bg-accent"
              }`}
            >
              {running ? "⟳ Running..." : "▶ Run Pipeline"}
            </motion.button>

            {(finished || doneCount > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ opacity: 0.85 }}
                whileTap={{ scale: 0.97 }}
                onClick={reset}
                className="rounded-xl border border-border bg-transparent px-5 py-3 text-sm font-medium text-muted-foreground"
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
                className="flex items-center gap-3 rounded-2xl border border-accent bg-accent/10 px-4 py-3 text-sm text-accent"
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

export function DockerAnimation() {
  const layers = ["Base Image", "Dependencies", "Source Code", "Build Output", "Runtime"];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % (layers.length + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        {layers.map((layer, index) => (
          <motion.div
            key={layer}
            animate={{
              y: index < active ? 0 : 10,
              opacity: index < active ? 1 : 0.45,
              scale: index < active ? 1 : 0.98,
            }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-border bg-card/70 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">{layer}</span>
              <Box className={`h-4 w-4 ${index < active ? "text-accent" : "text-muted-foreground"}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-background/60 p-6">
        <motion.div
          animate={{ scale: active >= layers.length ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-cyan-400 text-white shadow-xl"
        >
          <Box className="h-10 w-10" />
        </motion.div>
        <p className="mt-4 text-sm font-semibold text-foreground">Container Ready</p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Docker layers build progressively into a deployable container image.
        </p>
      </div>
    </div>
  );
}

export function K8sAnimation() {
  const [replicas, setReplicas] = useState(3);
  const [failedPod, setFailedPod] = useState<number | null>(1);

  useEffect(() => {
    const failTimer = setInterval(() => {
      setFailedPod((prev) => (prev === null ? 1 : null));
    }, 1800);

    const scaleTimer = setInterval(() => {
      setReplicas((prev) => (prev === 3 ? 5 : 3));
    }, 4200);

    return () => {
      clearInterval(failTimer);
      clearInterval(scaleTimer);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: replicas }).map((_, index) => {
          const isFailed = failedPod === index;

          return (
            <motion.div
              key={`${replicas}-${index}`}
              animate={{
                y: isFailed ? [0, -6, 0] : 0,
                opacity: isFailed ? 0.35 : 1,
                scale: isFailed ? 0.96 : 1,
              }}
              transition={{ duration: 0.45 }}
              className={`rounded-2xl border p-4 text-center ${
                isFailed ? "border-red-500/40 bg-red-500/10" : "border-border bg-card/70"
              }`}
            >
              <Boxes className={`mx-auto h-8 w-8 ${isFailed ? "text-red-400" : "text-accent"}`} />
              <p className="mt-2 text-xs font-semibold text-foreground">pod-{index + 1}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {isFailed ? "Restarting..." : "Running"}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Self-healing:</span> when a pod fails,
        Kubernetes automatically replaces it. Scaling also adjusts replicas dynamically.
      </div>
    </div>
  );
}

export function TerraformAnimation() {
  const resources = ["VPC", "Subnets", "IAM", "EKS", "RDS", "ALB"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((prev) => (prev + 1) % (resources.length + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <TerminalBox
        lines={[
          "$ terraform plan",
          "+ aws_vpc.main",
          "+ aws_subnet.public_a",
          "+ aws_eks_cluster.main",
          "",
          "$ terraform apply -auto-approve",
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {resources.map((resource, index) => (
          <motion.div
            key={resource}
            animate={{
              opacity: index < step ? 1 : 0.4,
              y: index < step ? 0 : 10,
            }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-border bg-card/70 p-4 text-center"
          >
            <HardDrive className={`mx-auto h-6 w-6 ${index < step ? "text-accent" : "text-muted-foreground"}`} />
            <p className="mt-2 text-xs font-semibold text-foreground">{resource}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function AnsibleAnimation() {
  const tasks = ["Gather Facts", "Install Packages", "Update Config", "Restart Service"];
  const hosts = ["node-01", "node-02", "node-03"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((prev) => (prev + 1) % tasks.length);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task}
              className={`rounded-2xl border p-4 ${
                step === index ? "border-accent bg-accent/10" : "border-border bg-card/70"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{task}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {hosts.map((host) => (
            <div key={host} className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="text-sm font-semibold text-foreground">{host}</p>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="mt-3 h-2 rounded-full bg-gradient-to-r from-accent to-cyan-400"
              />
              <p className="mt-3 text-xs text-muted-foreground">{tasks[step]} running</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AWSAnimation() {
  const services = ["Route53", "ALB", "EKS", "RDS", "S3", "CloudFront"];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((service, index) => (
          <motion.div
            key={service}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl border border-accent/40 bg-card/70 p-4 text-center"
          >
            <Cloud className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-2 text-xs font-semibold text-foreground">{service}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
        Requests flow from DNS to load balancer, into compute, and out to storage and database services.
      </div>
    </div>
  );
}

export function PrometheusAnimation() {
  const [spike, setSpike] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSpike((prev) => !prev);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const bars = spike ? [45, 58, 66, 72, 95, 88, 76] : [28, 34, 30, 36, 42, 38, 35];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-7 items-end gap-3 rounded-2xl border border-border bg-background/60 p-4">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.55 }}
            className={`rounded-t-xl ${
              height > 80
                ? "bg-gradient-to-t from-red-500 to-orange-400"
                : "bg-gradient-to-t from-accent to-cyan-400"
            }`}
            style={{ minHeight: 20 }}
          />
        ))}
      </div>

      <div
        className={`rounded-2xl border p-4 text-sm ${
          spike
            ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-300"
            : "border-border bg-card/70 text-muted-foreground"
        }`}
      >
        <span className="font-semibold text-foreground">Alert Status:</span>{" "}
        {spike ? "High CPU detected • alert triggered" : "Metrics stable • no active alerts"}
      </div>
    </div>
  );
}

export function GitAnimation() {
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setMerged((prev) => !prev);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <p className="text-sm font-semibold text-foreground">feature/auth-flow</p>
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((node) => (
              <div key={node} className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: node * 0.1 }}
                  className="h-3 w-3 rounded-full bg-accent"
                />
                <span className="text-xs text-muted-foreground">commit-{node}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <p className="text-sm font-semibold text-foreground">main</p>
          <div className="mt-4 flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-accent" />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.3, repeat: Infinity }}
              className="text-xs text-muted-foreground"
            >
              {merged ? "Merged successfully" : "Awaiting pull request"}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LinuxAnimation() {
  return (
    <TerminalBox
      lines={[
        "$ top",
        "✓ CPU usage healthy",
        "$ df -h",
        "✓ disk usage 48%",
        "$ ss -tulpn",
        "✓ nginx listening on :80 and :443",
        "$ systemctl status docker",
        "✓ docker service is active",
      ]}
    />
  );
}

export function NginxAnimation() {
  const [target, setTarget] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTarget((prev) => (prev + 1) % 3);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const backends = ["app-01", "app-02", "app-03"];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 text-center">
        <Server className="mx-auto h-8 w-8 text-accent" />
        <p className="mt-3 text-sm font-bold text-foreground">Nginx Proxy</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {backends.map((backend, index) => (
          <motion.div
            key={backend}
            animate={{ scale: target === index ? 1.04 : 1 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border bg-card/70 p-4 text-center ${
              target === index ? "border-accent/50" : "border-border"
            }`}
          >
            <Server className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-3 text-sm font-semibold text-foreground">{backend}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {target === index ? "Receiving traffic" : "Healthy"}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}