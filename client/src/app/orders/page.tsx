"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function placeOrder() {
    setLoading(true);
    setMessage("");

    try {
      // Create Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id: "11111111-1111-1111-1111-111111111111",
          status: "Completed",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create Order Item
      const { error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          menu_item_id: "33333333-3333-3333-3333-333333333333",
          quantity: 1,
        });

      if (itemError) throw itemError;

      const recipe = [
        {
          ingredient: "22222222-2222-2222-2222-222222222221",
          qty: 0.2,
        },
        {
          ingredient: "22222222-2222-2222-2222-222222222222",
          qty: 0.25,
        },
        {
          ingredient: "22222222-2222-2222-2222-222222222223",
          qty: 0.05,
        },
      ];

      for (const item of recipe) {
        const { data, error } = await supabase
          .from("inventory")
          .select("current_quantity")
          .eq("ingredient_id", item.ingredient)
          .single();

        if (error) throw error;

        const { error: updateError } = await supabase
          .from("inventory")
          .update({
            current_quantity: data.current_quantity - item.qty,
          })
          .eq("ingredient_id", item.ingredient);

        if (updateError) throw updateError;

        const { error: txError } = await supabase
          .from("inventory_transactions")
          .insert({
            ingredient_id: item.ingredient,
            transaction_type: "SALE",
            quantity: item.qty,
          });

        if (txError) throw txError;
      }

      setMessage("✅ Order Placed Successfully");
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white p-10">
      <h1 className="text-5xl font-bold">Order Simulation</h1>

      <p className="text-slate-400 mt-3">
        Simulate restaurant orders.
      </p>

      <div className="mt-10 max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          Paneer Butter Masala
        </h2>

        <div className="mt-5 space-y-2 text-slate-300">
          <p>🍅 Tomato - 0.20 kg</p>
          <p>🧀 Paneer - 0.25 kg</p>
          <p>🧈 Butter - 0.05 kg</p>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="mt-8 flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-900 transition hover:scale-105 disabled:opacity-50"
        >
          <ShoppingCart size={20} />
          {loading ? "Placing..." : "Place Order"}
        </button>

        {message && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}