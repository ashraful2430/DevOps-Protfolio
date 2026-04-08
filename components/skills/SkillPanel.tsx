"use client";

import {
  AWSAnimation,
  AnsibleAnimation,
  CICDAnimation,
  DockerAnimation,
  GitAnimation,
  K8sAnimation,
  LinuxAnimation,
  NginxAnimation,
  PrometheusAnimation,
  TerraformAnimation,
} from "@/components/skills/SkillAnimations";
import { ReactNode } from "react";
import type { SkillKey } from "@/components/Skills";

const descriptions: Record<SkillKey, { title: string; subtitle: string }> = {
  cicd: {
    title: "CI/CD Pipeline — how it works",
    subtitle: "GitLab CI + Build + Test + Docker + Deploy",
  },
  docker: {
    title: "Docker — image build flow",
    subtitle: "Source → Dockerfile → Layers → Image → Container",
  },
  k8s: {
    title: "Kubernetes — self-healing cluster",
    subtitle: "Pods recover automatically and scale on demand",
  },
  terraform: {
    title: "Terraform — infrastructure as code",
    subtitle: "Plan → Apply → Resources provisioned in sequence",
  },
  ansible: {
    title: "Ansible — remote automation flow",
    subtitle: "Inventory → Playbook → Tasks executed across nodes",
  },
  aws: {
    title: "AWS — service architecture view",
    subtitle: "Traffic and services flowing through a production stack",
  },
  prometheus: {
    title: "Prometheus — monitoring & alerting",
    subtitle: "Metrics rise, threshold hits, alert gets triggered",
  },
  git: {
    title: "Git Flow — collaborative development",
    subtitle: "Feature branches merge cleanly into main",
  },
  linux: {
    title: "Linux — command-line operations",
    subtitle: "Common DevOps commands with live styled output",
  },
  nginx: {
    title: "Nginx — reverse proxy request flow",
    subtitle: "Requests route through Nginx to healthy upstreams",
  },
};

function resolveAnimation(skill: SkillKey): ReactNode {
  switch (skill) {
    case "cicd":
      return <CICDAnimation />;
    case "docker":
      return <DockerAnimation />;
    case "k8s":
      return <K8sAnimation />;
    case "terraform":
      return <TerraformAnimation />;
    case "ansible":
      return <AnsibleAnimation />;
    case "aws":
      return <AWSAnimation />;
    case "prometheus":
      return <PrometheusAnimation />;
    case "git":
      return <GitAnimation />;
    case "linux":
      return <LinuxAnimation />;
    case "nginx":
      return <NginxAnimation />;
    default:
      return null;
  }
}

export default function SkillPanel({ skill }: { skill: SkillKey }) {
  const copy = descriptions[skill];

  return (
    <div className="overflow-hidden rounded-[28px] border border-border bg-card/85 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-border bg-background/45 px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            {copy.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        <span className="ml-auto inline-flex w-fit items-center rounded-full border border-accent/30 bg-gradient-to-r from-accent/12 to-cyan-400/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-accent shadow-[0_0_20px_rgba(29,158,117,0.08)]">
          Interactive
        </span>
      </div>

      <div className="p-4 sm:p-6">{resolveAnimation(skill)}</div>
    </div>
  );
}
