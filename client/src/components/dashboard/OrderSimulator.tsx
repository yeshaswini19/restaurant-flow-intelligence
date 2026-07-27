"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function OrderSimulator() {
  const [menu, setMenu] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    const { data, error } = await supabase
  .from("menu_items")
  .select("id,name,is_active")
  .eq("is_active", true)
  .order("name");

if (error) {
  console.error(error);
  return;
}

    setMenu(data ?? []);

    if (data?.length) {
      setSelected(data[0].id);
    }
  }

  async function placeOrder() {
    if (!selected) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menuItemId: selected,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order failed");
      }

      setMessage("✅ Order placed successfully!");

      setQuantity(1);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8">
      <div className="mb-6 flex items-center gap-3">
        <ShoppingCart className="text-cyan-400" />

        <h2 className="text-2xl font-bold text-white">
          Live Order Simulator
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
        >
          {menu.map((dish) => (
            <option
  key={dish.id}
  value={dish.id}
>
  {dish.name}
</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
        />

        <button
          onClick={placeOrder}
          disabled={loading}
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Processing...
            </span>
          ) : (
            "Place Order"
          )}
        </button>
      </div>

      {message && (
        <div className="mt-6 rounded-xl border border-white/10 bg-slate-900 p-4 text-white">
          {message}
        </div>
      )}
    </section>
  );
}