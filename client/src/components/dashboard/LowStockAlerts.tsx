"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CircleCheckBig,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LowStockAlerts() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("low-stock-alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventory",
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    setLoading(true);

    const { data } = await supabase
      .from("inventory")
      .select(`
        current_quantity,
        ingredients(name)
      `);

    const alerts = (data || [])
      .filter((item: any) => Number(item.current_quantity) < 5)
      .sort(
        (a: any, b: any) =>
          Number(a.current_quantity) -
          Number(b.current_quantity)
      );

    setItems(alerts);
    setLoading(false);
  }

  return (
    <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-400" />

          <h2 className="text-2xl font-bold text-white">
            Low Stock Alerts
          </h2>
        </div>

        <button
          onClick={load}
          className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/30"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-400">
          Checking inventory...
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-5 text-green-400">
          <CircleCheckBig size={22} />
          <span>All ingredients are sufficiently stocked.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any, index) => {
            const qty = Number(item.current_quantity);

            const badgeClass =
              qty < 2
                ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400";

            const status =
              qty < 2 ? "Critical Stock" : "Low Stock";

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-red-500/10 bg-slate-900/60 p-4 transition hover:border-red-500/30"
              >
                <div>
                  <p className="font-medium text-white">
                    {item.ingredients?.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {status}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 font-semibold ${badgeClass}`}
                >
                  {qty.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}