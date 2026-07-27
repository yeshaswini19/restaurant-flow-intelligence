"use client";

import Link from "next/link";
import { ChefHat, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full text-center">

        <h1 className="text-6xl font-bold text-white">
          Kitchen<span className="text-cyan-400">Pulse</span>
        </h1>

        <p className="mt-5 text-zinc-400 text-lg">
          Smart Restaurant Intelligence Platform
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-8">

          <Link
            href="/customer"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 hover:border-cyan-500 transition"
          >
            <ShoppingBag className="mx-auto h-12 w-12 text-cyan-400" />
            <h2 className="mt-5 text-2xl font-semibold text-white">
              Customer Portal
            </h2>
            <p className="mt-3 text-zinc-400">
              Browse today's menu and place orders instantly.
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 hover:border-cyan-500 transition"
          >
            <ChefHat className="mx-auto h-12 w-12 text-cyan-400" />
            <h2 className="mt-5 text-2xl font-semibold text-white">
              Restaurant Dashboard
            </h2>
            <p className="mt-3 text-zinc-400">
              Manage inventory, analytics, AI insights and operations.
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}