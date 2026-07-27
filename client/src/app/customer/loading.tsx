export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08111f] text-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        <p className="mt-6 text-lg text-slate-400">
          Loading KitchenPulse...
        </p>
      </div>
    </main>
  );
}