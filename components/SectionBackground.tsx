"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type VariantType =
  | "fade-up"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "stagger";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  variant?: VariantType;
  delay?: number;
}

const variantsMap = {
  "fade-up": {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  stagger: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
};

export default function SectionReveal({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
}: SectionRevealProps) {
  return (
    <motion.div
      className={className}
      variants={variantsMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}