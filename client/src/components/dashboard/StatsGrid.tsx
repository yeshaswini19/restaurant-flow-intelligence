"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ClipboardList,
  UtensilsCrossed,
  PackageCheck,
  BrainCircuit,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid() {
  const [stats, setStats] = useState([
    {
      title: "Orders Today",
      value: "...",
      change: "Loading...",
      icon: <ClipboardList size={22} />,
      color: "text-emerald-400",
    },
    {
      title: "Available Dishes",
      value: "...",
      change: "Loading...",
      icon: <UtensilsCrossed size={22} />,
      color: "text-cyan-400",
    },
    {
      title: "Inventory Items",
      value: "...",
      change: "Loading...",
      icon: <PackageCheck size={22} />,
      color: "text-amber-400",
    },
    {
      title: "Inventory Health",
      value: "...",
      change: "Loading...",
      icon: <BrainCircuit size={22} />,
      color: "text-violet-400",
    },
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { data: inventory } = await supabase
      .from("inventory")
      .select("current_quantity");

    const { data: recipes } = await supabase
      .from("recipes")
      .select(`
        quantity_required,
        ingredients(id),
        menu_items(name)
      `);

    let availableDishes = 0;

    if (inventory && recipes) {
      const stockMap = new Map();

      const { data: inv } = await supabase
        .from("inventory")
        .select("ingredient_id,current_quantity");

      inv?.forEach((i: any) =>
        stockMap.set(i.ingredient_id, i.current_quantity)
      );

      const grouped: any = {};

      recipes.forEach((r: any) => {
        const dish = r.menu_items.name;

        if (!grouped[dish]) grouped[dish] = [];

        grouped[dish].push({
          required: r.quantity_required,
          ingredient: r.ingredients.id,
        });
      });

      Object.values(grouped).forEach((list: any) => {
        let ok = true;

        list.forEach((i: any) => {
          if ((stockMap.get(i.ingredient) || 0) < i.required)
            ok = false;
        });

        if (ok) availableDishes++;
      });
    }

    const inventoryItems = inventory?.length || 0;

    const healthy =
      inventory?.filter((i: any) => i.current_quantity > 1).length || 0;

    const health = inventoryItems
      ? Math.round((healthy / inventoryItems) * 100)
      : 0;

    setStats([
      {
        title: "Orders Today",
        value: String(orderCount || 0),
        change: "Live Orders",
        icon: <ClipboardList size={22} />,
        color: "text-emerald-400",
      },
      {
        title: "Available Dishes",
        value: String(availableDishes),
        change: "Computed Live",
        icon: <UtensilsCrossed size={22} />,
        color: "text-cyan-400",
      },
      {
        title: "Inventory Items",
        value: String(inventoryItems),
        change: "Ingredients",
        icon: <PackageCheck size={22} />,
        color: "text-amber-400",
      },
      {
        title: "Inventory Health",
        value: health + "%",
        change: "Stock Status",
        icon: <BrainCircuit size={22} />,
        color: "text-violet-400",
      },
    ]);
  }

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </section>
  );
}