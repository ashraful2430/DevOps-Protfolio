import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
        <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 text-sm text-white/50">
            terminal — route status
          </span>
        </div>

        <div className="space-y-3 font-mono text-sm sm:text-base">
          <p className="text-emerald-400">$ locate route</p>
          <p className="text-white/80">Error: route not found</p>
          <p className="text-red-400">404: route not found</p>
          <p className="text-white/60">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
