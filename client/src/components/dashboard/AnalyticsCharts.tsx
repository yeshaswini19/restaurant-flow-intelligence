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

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select(`
        quantity,
        menu_items(
          name,
          price
        )
      `);

    if (!orderItems) return;

    let totalRevenue = 0;
    let totalOrders = 0;

    const dishMap: Record<string, number> = {};

    orderItems.forEach((item: any) => {
      const qty = item.quantity;
      const price = item.menu_items.price;
      const name = item.menu_items.name;

      totalRevenue += qty * price;
      totalOrders += qty;

      dishMap[name] = (dishMap[name] || 0) + qty;
    });

    let bestDish = "-";
    let max = 0;

    Object.entries(dishMap).forEach(([dish, count]) => {
      if (count > max) {
        max = count;
        bestDish = dish;
      }
    });

    setOrders(totalOrders);
    setRevenue(totalRevenue);
    setAvgOrder(totalOrders ? totalRevenue / totalOrders : 0);
    setTopDish(bestDish);
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
      <h2 className="text-2xl font-bold text-white mb-8">
        Business Analytics
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-slate-900/70 p-6 border border-white/10"
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
    </section>
  );
}