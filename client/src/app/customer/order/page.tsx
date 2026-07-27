"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08111f] px-6 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-green-400" />

        <h1 className="text-4xl font-bold">Order Placed!</h1>

        <p className="mt-4 text-slate-400">
          Your order has been received successfully.
        </p>

        <div className="mt-8 rounded-2xl bg-white/5 p-6">
          <p className="text-lg">Estimated Preparation Time</p>

          <p className="mt-3 text-5xl font-bold text-cyan-400">
            18 mins
          </p>
        </div>

        <Link
          href="/customer"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </Link>
      </div>
    </main>
  );
}