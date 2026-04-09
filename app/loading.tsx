export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
        <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 text-sm text-white/50">terminal — loading</span>
        </div>

        <div className="font-mono text-sm sm:text-base">
          <p className="text-emerald-400">$ booting portfolio...</p>

          <div className="mt-4 flex items-center gap-3 text-white/80">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <span>
              Loading modules, rendering interface, preparing experience...
            </span>
          </div>

          <p className="mt-4 animate-pulse text-white/50">Please wait...</p>
        </div>
      </div>
    </main>
  );
}
