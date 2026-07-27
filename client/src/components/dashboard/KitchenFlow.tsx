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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("kitchen-flow-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        load
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventory",
        },
        load
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    setLoading(true);

    const [{ count: orderCount }, { count: ingredientCount }, { data: recipeData }, { data: inventory }] =
      await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("ingredients").select("*", { count: "exact", head: true }),
        supabase.from("recipes").select(`
          quantity_required,
          ingredients(id),
          menu_items(id,name)
        `),
        supabase
          .from("inventory")
          .select("ingredient_id,current_quantity"),
      ]);

    setOrders(orderCount ?? 0);
    setIngredients(ingredientCount ?? 0);

    const stockMap = new Map<string, number>();

    inventory?.forEach((item: any) => {
      stockMap.set(item.ingredient_id, item.current_quantity);
    });

    const grouped: Record<string, any[]> = {};

    recipeData?.forEach((recipe: any) => {
      const dish = recipe.menu_items.name;

      if (!grouped[dish]) grouped[dish] = [];

      grouped[dish].push({
        ingredient: recipe.ingredients.id,
        required: recipe.quantity_required,
      });
    });

    let live = 0;

    Object.keys(grouped).forEach((dish) => {
      const ok = grouped[dish].every(
        (ingredient) =>
          (stockMap.get(ingredient.ingredient) ?? 0) >=
          ingredient.required
      );

      if (ok) live++;
    });

    setRecipes(Object.keys(grouped).length);
    setAvailable(live);
    setLoading(false);
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
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Live Architecture
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Operational Pipeline
          </h2>

          <p className="mt-2 text-slate-400">
            Every order instantly updates inventory, recipe availability,
            analytics and AI insights.
          </p>
        </div>

        <div className="rounded-full bg-green-500/20 px-4 py-2 font-semibold text-green-400">
          ● LIVE
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          Loading live pipeline...
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-6 xl:flex-row">
          {flow.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex items-center gap-5"
              >
                <div className="min-w-[185px] rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:border-cyan-500/40">
                  <div className="mb-5 w-fit rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-4xl font-bold text-cyan-400">
                    {step.value}
                  </p>

                  <p className="mt-2 text-slate-400">
                    {step.subtitle}
                  </p>
                </div>

                {index < flow.length - 1 && (
                  <ArrowRight className="hidden text-cyan-400 xl:block" />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
        <p className="text-slate-300">
          <span className="font-semibold text-cyan-400">
            Live Flow:
          </span>{" "}
          Customer Order → Inventory Deduction → Recipe Validation →
          Dish Availability → Dashboard Update → AI Operational Insights
        </p>
      </div>
    </section>
     );
}