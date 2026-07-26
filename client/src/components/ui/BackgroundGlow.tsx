"use client";

import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
        }}
        className="fixed left-[-150px] top-[-150px]
        h-[420px] w-[420px]
        rounded-full
        bg-cyan-500/20
        blur-[120px]
        -z-10"
      />

      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, -80, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
        }}
        className="fixed right-[-150px] bottom-[-150px]
        h-[420px] w-[420px]
        rounded-full
        bg-violet-500/20
        blur-[120px]
        -z-10"
      />
    </>
  );
}