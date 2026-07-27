"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Sparkles,
  Clock3,
  Star,
  Home,
} from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
};

export default function CustomerPage() {
  const router = useRouter();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menu`
      );

      const json = await res.json();
      setMenu(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (menuItemId: string) => {
    try {
      setOrderingId(menuItemId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menuItemId,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to place order");
        return;
      }

      router.push("/customer/order");
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server.");
    } finally {
      setOrderingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-4xl font-bold">KitchenPulse</h1>
            <p className="mt-2 text-slate-400">
              Smart Restaurant Experience
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-slate-300 transition hover:bg-cyan-500/15 hover:text-white"
          >
            <Home size={18} />
            Home
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl p-8">
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Sparkles className="mb-3 text-cyan-400" />
            <h3 className="text-xl font-bold">
              AI Recommendations
            </h3>
            <p className="mt-2 text-slate-400">
              Personalized dishes based on popularity and kitchen efficiency.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Clock3 className="mb-3 text-cyan-400" />
            <h3 className="text-xl font-bold">
              Live Availability
            </h3>
            <p className="mt-2 text-slate-400">
              Only currently available dishes are shown.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Star className="mb-3 text-cyan-400" />
            <h3 className="text-xl font-bold">
              Fast Ordering
            </h3>
            <p className="mt-2 text-slate-400">
              Place your order instantly.
            </p>
          </div>
        </div>

        <h2 className="mb-6 text-3xl font-bold">
          Today's Menu
        </h2>

        {loading ? (
          <p>Loading menu...</p>
        ) : menu.filter((item) => item.is_active).length === 0 ? (
          <p className="text-slate-400">
            No dishes are currently available.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {menu
              .filter((item) => item.is_active)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <UtensilsCrossed className="text-cyan-400" />

                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                      Available
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-slate-400">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-400">
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() => placeOrder(item.id)}
                      disabled={orderingId === item.id}
                      className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black disabled:opacity-50"
                    >
                      {orderingId === item.id
                        ? "Ordering..."
                        : "Order"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}