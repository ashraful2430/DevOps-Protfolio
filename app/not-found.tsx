import Link from "next/link";
import { ArrowLeft, Home, Radar, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20 text-foreground">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,158,117,0.22),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.14),transparent_35%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Radar className="h-4 w-4" />
            Route Signal Lost
          </div>

          <h1 className="mt-6 text-7xl font-black tracking-tight text-foreground sm:text-8xl lg:text-9xl">
            404
          </h1>

          <p className="mt-4 max-w-xl text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            This route drifted outside the production cluster.
          </p>

          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
            The page may have moved, been renamed, or never existed. Head back
            to the portfolio home and continue from a healthy route.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent via-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_42px_rgba(16,185,129,0.24)] transition hover:scale-[1.02]"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-5 py-3 text-sm font-bold text-muted-foreground transition hover:border-accent/30 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
          </div>
        </div>

        <div className="relative min-h-[460px] [perspective:1200px]">
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 bg-accent/[0.03] shadow-[0_30px_120px_rgba(29,158,117,0.18)] [animation:float-3d_8s_ease-in-out_infinite]" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15 [animation:orbit-3d_22s_linear_infinite]" />
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20 [animation:orbit-3d_16s_linear_infinite_reverse]" />

          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] [animation:cube-spin_20s_linear_infinite]">
            {[
              "translateZ(64px)",
              "rotateY(180deg) translateZ(64px)",
              "rotateY(90deg) translateZ(64px)",
              "rotateY(-90deg) translateZ(64px)",
              "rotateX(90deg) translateZ(64px)",
              "rotateX(-90deg) translateZ(64px)",
            ].map((transform, index) => (
              <div
                key={transform}
                className="absolute inset-0 flex items-center justify-center border border-accent/25 bg-black/55 text-2xl font-black text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
                style={{ transform }}
              >
                {index === 0 ? "404" : ""}
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 rounded-[28px] border border-border bg-card/80 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Terminal className="h-4 w-4" />
                ashik@portfolio-route
              </span>
            </div>

            <div className="space-y-2 font-mono text-sm leading-7">
              <p className="text-emerald-400">$ kubectl get route missing-page</p>
              <p className="text-cyan-400">status: NotFound</p>
              <p className="text-red-400">reason: route endpoint unavailable</p>
              <p className="text-muted-foreground">
                recovery: redirect user to stable homepage
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
