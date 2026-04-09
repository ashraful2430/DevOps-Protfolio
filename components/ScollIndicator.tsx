"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  const handleScroll = () => {
    const nextSection =
      document.querySelector("#skills") ||
      document.querySelector("#projects") ||
      document.querySelector("section:nth-of-type(2)");

    nextSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.button
      onClick={handleScroll}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8 }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative mx-auto mt-10 flex flex-col items-center gap-3"
      aria-label="Scroll down"
    >
      <div className="relative">
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotateX: [0, 8, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex h-16 w-10 items-start justify-center rounded-full border border-accent/30 bg-background/60 p-2 shadow-[0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.span
            animate={{
              y: [0, 24, 0],
              opacity: [0.9, 0.35, 0.9],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="block h-3.5 w-3.5 rounded-full bg-gradient-to-b from-accent to-cyan-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          />
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.18, 0.32, 0.18],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
        />
      </div>

      <div className="relative flex flex-col items-center">
        <motion.span
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-accent"
        >
          Scroll Down
        </motion.span>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="mt-1 text-accent"
        >
          ↓
        </motion.div>
      </div>
    </motion.button>
  );
}
