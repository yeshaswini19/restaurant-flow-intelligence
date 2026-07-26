"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ChefHat,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function AvailabilityPage() {
  const [dishes, setDishes] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: recipes } = await supabase
      .from("recipes")
      .select(`
        quantity_required,
        ingredients(
          id,
          name,
          unit
        ),
        menu_items(
          name
        )
      `);

    const { data: inventory } = await supabase
      .from("inventory")
      .select("ingredient_id,current_quantity");

    if (!recipes || !inventory) return;

    const stockMap = new Map(
      inventory.map((i: any) => [
        i.ingredient_id,
        i.current_quantity,
      ])
    );

    const grouped: any = {};

    recipes.forEach((r: any) => {
      const dish = r.menu_items.name;

      if (!grouped[dish]) grouped[dish] = [];

      grouped[dish].push({
        ingredient: r.ingredients.name,
        unit: r.ingredients.unit,
        required: r.quantity_required,
        available:
          stockMap.get(r.ingredients.id) ?? 0,
      });
    });

    const result = Object.keys(grouped).map((dish) => {
      const ingredients = grouped[dish];

      let servings = Number.MAX_SAFE_INTEGER;

      ingredients.forEach((i: any) => {
        servings = Math.min(
          servings,
          Math.floor(i.available / i.required)
        );
      });

      return {
        dish,
        servings,
        available: servings > 0,
        ingredients,
      };
    });

    setDishes(result);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        Live Dish Availability
      </h1>

      <div className="space-y-8">

        {dishes.map((dish: any) => (

          <div
            key={dish.dish}
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
          >

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-4">

                <ChefHat
                  size={34}
                  className="text-cyan-400"
                />

                <div>

                  <h2 className="text-3xl font-bold">
                    {dish.dish}
                  </h2>

                  <p className="text-slate-400 mt-1">

                    Maximum Servings

                    <span className="ml-2 text-cyan-400 font-bold">

                      {dish.servings}

                    </span>

                  </p>

                </div>

              </div>

              {dish.available ? (

                <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-5 py-3 text-green-400">

                  <CheckCircle2 />

                  Available

                </div>

              ) : (

                <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-5 py-3 text-red-400">

                  <XCircle />

                  Out Of Stock

                </div>

              )}

            </div>

            <div className="mt-8 space-y-4">

              {dish.ingredients.map((i: any) => {

                const enough =
                  i.available >= i.required;

                return (

                  <div
                    key={i.ingredient}
                    className={`rounded-2xl border p-5 flex justify-between ${
                      enough
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-red-500/20 bg-red-500/5"
                    }`}
                  >

                    <div>

                      <p className="font-semibold text-lg">

                        {i.ingredient}

                      </p>

                      <p className="text-slate-400 text-sm mt-1">

                        Required

                        {" "}

                        {i.required}

                        {" "}

                        {i.unit}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-lg font-semibold">

                        {i.available}

                        {" "}

                        {i.unit}

                      </p>

                      {enough ? (

                        <p className="text-green-400">

                          In Stock

                        </p>

                      ) : (

                        <div className="flex items-center gap-2 text-red-400 justify-end">

                          <AlertTriangle size={16}/>

                          Insufficient

                        </div>

                      )}

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}