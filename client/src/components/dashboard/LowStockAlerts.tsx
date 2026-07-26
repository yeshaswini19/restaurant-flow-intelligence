"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LowStockAlerts() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("inventory")
      .select(`
        current_quantity,
        ingredients(name)
      `);

    setItems(
      (data || []).filter(
        (item: any) => Number(item.current_quantity) < 1
      )
    );
  }

  return (
    <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-red-400" />
        <h2 className="text-2xl font-bold text-white">
          Low Stock Alerts
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl bg-green-500/10 p-4 text-green-400">
          ✅ All ingredients are sufficiently stocked.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any, index) => (
            <div
              key={index}
              className="flex justify-between rounded-xl bg-slate-900/60 p-4"
            >
              <span className="text-white">
                {item.ingredients?.name}
              </span>

              <span className="text-red-400">
                {item.current_quantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}