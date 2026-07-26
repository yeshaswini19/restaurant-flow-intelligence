"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ClipboardList,
  Package,
  Network,
  UtensilsCrossed,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";

export default function KitchenFlow() {
  const [orders, setOrders] = useState(0);
  const [ingredients, setIngredients] = useState(0);
  const [recipes, setRecipes] = useState(0);
  const [available, setAvailable] = useState(0);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { count: ingredientCount } = await supabase
      .from("ingredients")
      .select("*", { count: "exact", head: true });

    const { data: recipeData } = await supabase
      .from("recipes")
      .select(`
        quantity_required,
        ingredients(id),
        menu_items(name)
      `);

    const { data: inventory } = await supabase
      .from("inventory")
      .select("ingredient_id,current_quantity");

    setOrders(orderCount || 0);
    setIngredients(ingredientCount || 0);

    const stockMap = new Map();

    inventory?.forEach((i: any) => {
      stockMap.set(i.ingredient_id, i.current_quantity);
    });

    const grouped: any = {};

    recipeData?.forEach((r: any) => {
      const dish = r.menu_items.name;

      if (!grouped[dish]) grouped[dish] = [];

      grouped[dish].push({
        ingredient: r.ingredients.id,
        required: r.quantity_required,
      });
    });

    let live = 0;

    Object.keys(grouped).forEach((dish) => {
      let ok = true;

      grouped[dish].forEach((i: any) => {
        if ((stockMap.get(i.ingredient) || 0) < i.required)
          ok = false;
      });

      if (ok) live++;
    });

    setRecipes(Object.keys(grouped).length);
    setAvailable(live);
  }

  const flow = [
    {
      icon: ClipboardList,
      title: "Orders",
      value: orders,
      subtitle: "Orders Received",
    },
    {
      icon: Package,
      title: "Inventory",
      value: ingredients,
      subtitle: "Ingredients",
    },
    {
      icon: Network,
      title: "Recipe Graph",
      value: recipes,
      subtitle: "Recipes Loaded",
    },
    {
      icon: UtensilsCrossed,
      title: "Availability",
      value: available,
      subtitle: "Ready To Serve",
    },
    {
      icon: BrainCircuit,
      title: "AI Engine",
      value: "LIVE",
      subtitle: "Decision Engine",
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="uppercase tracking-[0.25em] text-cyan-400 text-sm">
            Live Architecture
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Operational Pipeline
          </h2>

          <p className="text-slate-400 mt-2">
            Real-time restaurant workflow driven by Supabase.
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-400">
          ● LIVE
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">

        {flow.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="flex items-center gap-5"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 min-w-[180px]">

                <div className="bg-cyan-500/10 w-fit p-3 rounded-xl text-cyan-400 mb-5">
                  <Icon size={24} />
                </div>

                <h3 className="font-bold text-xl">
                  {step.title}
                </h3>

                <p className="text-4xl font-bold mt-4 text-cyan-400">
                  {step.value}
                </p>

                <p className="text-slate-400 mt-2">
                  {step.subtitle}
                </p>

              </div>

              {index < flow.length - 1 && (
                <ArrowRight className="hidden xl:block text-cyan-400" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
        <p className="text-slate-300">
          Every customer order automatically checks recipes, inventory,
          ingredient dependencies and computes dish availability in real time.
        </p>
      </div>
    </section>
  );
}