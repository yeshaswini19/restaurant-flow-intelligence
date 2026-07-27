"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-8 border-b border-white/10">
      <div>
        <p className="text-cyan-400 font-semibold uppercase tracking-[0.25em] text-xs">
          RESTAURANT OPERATIONS
        </p>

        <h2 className="text-4xl font-bold text-white mt-2">
          Restaurant Operations Command Center
        </h2>

        <p className="text-slate-400 mt-2 text-lg">
          Monitor inventory, orders, recipe dependencies and operational health
          in real time through one intelligent dashboard.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-slate-300 transition hover:bg-cyan-500/15 hover:text-white"
        >
          <Home size={18} />
          Home
        </Link>

        <div className="flex items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

          <span className="text-green-400 font-semibold tracking-wide">
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}