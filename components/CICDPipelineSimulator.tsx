"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const pipelineSteps = [
  {
    id: "push",
    label: "Push",
    command: "git push origin main",
    logs: [
      "$ git push origin main",
      "Enumerating objects: 12, done.",
      "Writing objects: 100% (7/7), 1.23 KiB",
      "✓ Source pushed successfully",
    ],
  },
  {
    id: "build",
    label: "Build",
    command: "npm run build",
    logs: [
      "$ npm run build",
      "Installing dependencies...",
      "Compiling TypeScript...",
      "✓ Build completed",
    ],
  },
  {
    id: "test",
    label: "Test",
    command: "npm run test -- --ci",
    logs: [
      "$ npm run test -- --ci",
      "PASS Hero.test.tsx",
      "PASS Skills.test.tsx",
      "✓ All tests passed",
    ],
  },
  {
    id: "docker",
    label: "Docker",
    command: "docker build -t app:latest .",
    logs: [
      "$ docker build -t app:latest .",
      "Step 1/6 : FROM node:20-alpine",
      'Step 6/6 : CMD ["node","server.js"]',
      "✓ Docker image built",
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    command: "kubectl rollout restart deployment/app",
    logs: [
      "$ kubectl rollout restart deployment/app",
      "deployment.apps/app restarted",
      "Waiting for rollout to finish...",
      "✓ Deployment successful",
    ],
  },
];

type StepState = "idle" | "running" | "done";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function CICDPipelineSimulator() {
  const [stepStates, setStepStates] = useState<StepState[]>(
    pipelineSteps.map(() => "idle"),
  );
  const [logs, setLogs] = useState<string[]>([
    "# CI/CD Pipeline ready",
    "# Click run to simulate the flow",
  ]);
  const [running, setRunning] = useState(false);

  const progress = useMemo(() => {
    const done = stepStates.filter((s) => s === "done").length;
    return Math.round((done / pipelineSteps.length) * 100);
  }, [stepStates]);

  const runPipeline = async () => {
    if (running) return;

    setRunning(true);
    setStepStates(pipelineSteps.map(() => "idle"));
    setLogs(["$ Starting pipeline...", ""]);

    for (let i = 0; i < pipelineSteps.length; i++) {
      setStepStates((prev) =>
        prev.map((state, index) =>
          index === i ? "running" : index < i ? "done" : "idle",
        ),
      );

      for (const line of pipelineSteps[i].logs) {
        await sleep(320);
        setLogs((prev) => [...prev, line]);
      }

      await sleep(250);

      setStepStates((prev) =>
        prev.map((state, index) => (index <= i ? "done" : "idle")),
      );
    }

    setLogs((prev) => [...prev, "", "✓ Pipeline finished successfully"]);
    setRunning(false);
  };

  const resetPipeline = () => {
    setRunning(false);
    setStepStates(pipelineSteps.map(() => "idle"));
    setLogs(["# CI/CD Pipeline ready", "# Click run to simulate the flow"]);
  };

  return (
    <div className="rounded-[28px] border border-border bg-card/70 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              CI/CD Pipeline Simulator
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Push → Build → Test → Docker → Deploy
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {running ? "Running" : progress === 100 ? "Complete" : "Ready"}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-5">
          {pipelineSteps.map((step, index) => {
            const state = stepStates[index];

            return (
              <motion.div
                key={step.id}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border p-4 transition-all ${
                  state === "running"
                    ? "border-yellow-500/30 bg-yellow-500/10"
                    : state === "done"
                      ? "border-accent/30 bg-accent/10"
                      : "border-border bg-background/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-foreground">
                    {step.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                      state === "running"
                        ? "bg-yellow-500/15 text-yellow-300"
                        : state === "done"
                          ? "bg-accent/15 text-accent"
                          : "bg-card text-muted-foreground"
                    }`}
                  >
                    {state}
                  </span>
                </div>

                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {step.command}
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border/60">
                  <motion.div
                    animate={{
                      width:
                        state === "done"
                          ? "100%"
                          : state === "running"
                            ? "65%"
                            : "8%",
                    }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${
                      state === "running"
                        ? "bg-yellow-400"
                        : "bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Progress</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-accent via-emerald-400 to-cyan-400"
            />
          </div>
          <span className="text-sm font-semibold text-accent">{progress}%</span>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background/70">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-muted-foreground">
              pipeline@runner
            </span>
          </div>

          <div className="h-[220px] overflow-y-auto px-4 py-4 font-mono text-xs leading-6 sm:text-sm">
            {logs.map((line, index) => (
              <p
                key={`${line}-${index}`}
                className={
                  line.startsWith("$")
                    ? "text-foreground"
                    : line.startsWith("✓") || line.startsWith("PASS")
                      ? "text-accent"
                      : "text-muted-foreground"
                }
              >
                {line || "\u00A0"}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={runPipeline}
            disabled={running}
            className={`rounded-2xl px-5 py-3 text-sm font-bold text-white transition ${
              running
                ? "cursor-not-allowed bg-accent/60"
                : "bg-gradient-to-r from-accent via-emerald-500 to-cyan-500"
            }`}
          >
            {running ? "Running..." : "Run Pipeline"}
          </button>

          <button
            onClick={resetPipeline}
            className="rounded-2xl border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-card"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
