"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit } from "lucide-react";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/40 p-10"
    >
      {/* Background Glow */}
      <div className="absolute -top-28 right-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Real-Time Restaurant Intelligence
        </div>

        <h1 className="mt-8 text-6xl font-bold tracking-tight text-white">
          KitchenPulse
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Gain complete visibility into inventory, recipes, orders, stock
          availability and operational performance through one intelligent
          restaurant management platform.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-900 transition-all hover:scale-105">
            View Live Operations
            <ArrowRight size={18} />
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white transition-all hover:border-cyan-400/40 hover:bg-white/10">
            <BrainCircuit size={18} />
            AI Insights
          </button>
        </div>
      </div>
    </motion.section>
  );
}