"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  color = "text-cyan-400",
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
      className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-cyan-400/20"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-400">
          {icon}
        </div>

        <ArrowUpRight
          size={18}
          className="text-slate-500 transition group-hover:text-cyan-400"
        />
      </div>

      <p className="mt-6 text-sm tracking-wide text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold text-white">
        {value}
      </h2>

      <p className={`mt-3 text-sm font-medium ${color}`}>
        {change}
      </p>
    </motion.div>
  );
}
