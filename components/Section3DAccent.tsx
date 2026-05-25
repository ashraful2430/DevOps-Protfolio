type Section3DAccentProps = {
  align?: "left" | "right";
  label?: string;
};

export default function Section3DAccent({
  align = "right",
  label = "AWS",
}: Section3DAccentProps) {
  const sideClass =
    align === "right"
      ? "right-[-48px] top-20 sm:right-4"
      : "left-[-48px] top-20 sm:left-4";

  return (
    <div
      className={`pointer-events-none absolute ${sideClass} hidden h-56 w-56 opacity-70 lg:block`}
      aria-hidden="true"
    >
      <div className="absolute inset-6 rounded-full border border-accent/20 bg-accent/[0.03] shadow-[0_30px_90px_rgba(16,185,129,0.16)] [animation:float-3d_9s_ease-in-out_infinite]" />
      <div className="absolute inset-10 rounded-full border border-cyan-400/15 [animation:orbit-3d_18s_linear_infinite]" />
      <div className="absolute inset-16 rounded-full border border-emerald-400/20 [animation:orbit-3d_14s_linear_infinite_reverse]" />

      <span className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.8)]" />
      <span className="absolute bottom-8 right-12 h-3 w-3 rounded-full bg-accent shadow-[0_0_22px_rgba(29,158,117,0.8)]" />

      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 [perspective:700px]">
        <div className="relative h-full w-full [animation:cube-spin_18s_linear_infinite] [transform-style:preserve-3d]">
          {[
            "translateZ(40px)",
            "rotateY(180deg) translateZ(40px)",
            "rotateY(90deg) translateZ(40px)",
            "rotateY(-90deg) translateZ(40px)",
            "rotateX(90deg) translateZ(40px)",
            "rotateX(-90deg) translateZ(40px)",
          ].map((transform, index) => (
            <div
              key={transform}
              className="absolute inset-0 flex items-center justify-center border border-accent/25 bg-black/45 text-[10px] font-black uppercase tracking-[0.22em] text-accent backdrop-blur-sm"
              style={{ transform }}
            >
              {index === 0 ? label : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
