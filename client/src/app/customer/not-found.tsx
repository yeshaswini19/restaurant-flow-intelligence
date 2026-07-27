import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08111f] px-6 text-white">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-cyan-400">404</h1>

        <h2 className="mt-4 text-3xl font-bold">
          Page Not Found
        </h2>

        <p className="mt-4 text-slate-400">
          The page you're looking for doesn't exist.
        </p>

        <Link
          href="/customer"
          className="mt-8 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black"
        >
          Back to Customer Portal
        </Link>
      </div>
    </main>
  );
}