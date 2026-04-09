"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  HardDrive,
  Network,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const nodes = [
  { id: "users", label: "Users", icon: Cloud },
  { id: "route53", label: "Route 53", icon: Workflow },
  { id: "alb", label: "Load Balancer", icon: Network },
  { id: "eks", label: "EKS Cluster", icon: Server },
  { id: "app1", label: "App Pod 01", icon: Server },
  { id: "app2", label: "App Pod 02", icon: Server },
  { id: "rds", label: "RDS", icon: Database },
  { id: "s3", label: "S3", icon: HardDrive },
  { id: "iam", label: "IAM", icon: ShieldCheck },
];

const positions: Record<string, string> = {
  users: "left-[4%] top-[44%]",
  route53: "left-[20%] top-[44%]",
  alb: "left-[37%] top-[44%]",
  eks: "left-[55%] top-[44%]",
  app1: "left-[74%] top-[24%]",
  app2: "left-[74%] top-[44%]",
  rds: "left-[74%] top-[66%]",
  s3: "left-[90%] top-[24%]",
  iam: "left-[90%] top-[66%]",
};

export default function InfrastructureMap() {
  return (
    <section id="infrastructure-map" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Infrastructure
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            AWS Infrastructure Map
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            A visual overview of a modern cloud stack with networking, compute,
            storage, database, and secure access flow.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[32px] border border-border bg-card/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
          <div className="relative hidden h-[520px] w-full lg:block">
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
                  <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0.15)" />
                </linearGradient>
              </defs>

              {[
                { x1: 90, y1: 250, x2: 235, y2: 250 },
                { x1: 235, y1: 250, x2: 430, y2: 250 },
                { x1: 430, y1: 250, x2: 640, y2: 250 },
                { x1: 640, y1: 250, x2: 860, y2: 145 },
                { x1: 640, y1: 250, x2: 860, y2: 250 },
                { x1: 640, y1: 250, x2: 860, y2: 355 },
                { x1: 860, y1: 145, x2: 1030, y2: 145 },
                { x1: 860, y1: 355, x2: 1030, y2: 355 },
              ].map((line, index) => (
                <motion.line
                  key={index}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="url(#flowLine)"
                  strokeWidth="3"
                  strokeDasharray="10 10"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -40 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </svg>

            {nodes.map((node) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`absolute ${positions[node.id]} w-[140px] -translate-x-1/2 -translate-y-1/2`}
                >
                  <div className="rounded-2xl border border-border bg-background/75 p-4 text-center shadow-lg backdrop-blur-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-foreground">
                      {node.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-4 lg:hidden sm:grid-cols-2">
            {nodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  className="rounded-2xl border border-border bg-background/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {node.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
