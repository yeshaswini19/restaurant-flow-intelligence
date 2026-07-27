"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Award,
} from "lucide-react";

export default function AnalyticsCharts() {
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [topDish, setTopDish] = useState("-");
  const [avgOrder, setAvgOrder] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();

    const channel = supabase
      .channel("analytics-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
        },
        () => loadAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    const { data: orderItems } = await supabase
      .from("order_items")
      .select(`
        quantity,
        menu_items(
          name,
          price
        )
      `);

    if (!orderItems) {
      setLoading(false);
      return;
    }

    let totalRevenue = 0;
    let totalItemsSold = 0;

    const dishMap: Record<string, number> = {};

    orderItems.forEach((item: any) => {
      const qty = Number(item.quantity);
      const price = Number(item.menu_items?.price ?? 0);
      const name = item.menu_items?.name ?? "Unknown";

      totalRevenue += qty * price;
      totalItemsSold += qty;

      dishMap[name] = (dishMap[name] || 0) + qty;
    });

    let bestDish = "-";
    let highestSales = 0;

    Object.entries(dishMap).forEach(([dish, count]) => {
      if (count > highestSales) {
        highestSales = count;
        bestDish = dish;
      }
    });

    setOrders(totalItemsSold);
    setRevenue(totalRevenue);
    setAvgOrder(
      totalItemsSold ? totalRevenue / totalItemsSold : 0
    );
    setTopDish(bestDish);
    setLoading(false);
  }

  const cards = [
    {
      icon: <ShoppingBag className="text-cyan-400" />,
      title: "Items Sold",
      value: orders,
    },
    {
      icon: <IndianRupee className="text-green-400" />,
      title: "Revenue",
      value: `₹${revenue.toFixed(2)}`,
    },
    {
      icon: <Award className="text-yellow-400" />,
      title: "Top Dish",
      value: topDish,
    },
    {
      icon: <TrendingUp className="text-purple-400" />,
      title: "Average Order",
      value: `₹${avgOrder.toFixed(2)}`,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Business Analytics
        </h2>

        <button
          onClick={loadAnalytics}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          Loading analytics...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-cyan-500/30"
            >
              <div className="mb-5">{card.icon}</div>

              <p className="text-slate-400">
                {card.title}
              </p>

              <h3 className="mt-3 text-3xl font-bold text-white">
                {card.value}
              </h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}