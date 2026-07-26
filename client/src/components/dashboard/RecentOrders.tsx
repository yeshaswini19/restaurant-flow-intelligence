"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        created_at,
        order_items(
          quantity,
          menu_items(name)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    setOrders(data || []);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Recent Orders
      </h2>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-xl bg-slate-900/60 p-4"
          >
            <div>
              <p className="font-semibold text-white">
                {order.order_items?.[0]?.menu_items?.name || "Order"}
              </p>

              <p className="text-sm text-slate-400">
                Qty: {order.order_items?.[0]?.quantity || 1}
              </p>
            </div>

            <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-400">
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}