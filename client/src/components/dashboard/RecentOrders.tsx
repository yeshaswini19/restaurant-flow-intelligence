"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("recent-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadOrders() {
    setLoading(true);

    const { data } = await supabase
      .from("orders")
      .select(
        `
        id,
        status,
        created_at,
        order_items(
          quantity,
          menu_items(name)
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(10);

    setOrders(data || []);
    setLoading(false);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Recent Orders
        </h2>

        <button
          onClick={loadOrders}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-400">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/60 p-4 transition hover:border-cyan-500/30"
            >
              <div>
                <p className="font-semibold text-white">
                  {order.order_items?.[0]?.menu_items?.name ?? "Order"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Quantity: {order.order_items?.[0]?.quantity ?? 1}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  order.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : order.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}