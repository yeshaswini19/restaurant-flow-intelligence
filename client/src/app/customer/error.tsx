"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08111f] px-6 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center">
        <h1 className="text-4xl font-bold text-red-400">
          Something went wrong
        </h1>

        <p className="mt-4 text-slate-400">
          An unexpected error occurred while loading the customer portal.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black"
          >
            Try Again
          </button>

          <Link
            href="/customer"
            className="rounded-xl border border-white/10 px-6 py-3"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}