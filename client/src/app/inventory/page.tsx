"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Search, AlertTriangle } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  minimum_quantity: number;
}

interface Inventory {
  ingredient_id: string;
  current_quantity: number;
}

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  minimum_quantity: number;
  current_quantity: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    const [{ data: ingredients, error: ingredientsError }, { data: inventory, error: inventoryError }] =
      await Promise.all([
        supabase
          .from("ingredients")
          .select("id, name, unit, minimum_quantity")
          .order("name"),
        supabase
          .from("inventory")
          .select("ingredient_id, current_quantity"),
      ]);

    if (ingredientsError) {
      console.error(ingredientsError);
      return;
    }

    if (inventoryError) {
      console.error(inventoryError);
      return;
    }

    const inventoryMap = new Map(
      (inventory as Inventory[]).map((item) => [
        item.ingredient_id,
        item.current_quantity,
      ])
    );

    const merged = (ingredients as Ingredient[]).map((ingredient) => ({
      ...ingredient,
      current_quantity: inventoryMap.get(ingredient.id) ?? 0,
    }));

    setItems(merged);
  }

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  function getStatus(stock: number, minimum: number) {
    if (stock <= minimum)
      return {
        label: "Critical",
        color: "bg-red-500/20 text-red-400",
      };

    if (stock <= minimum * 2)
      return {
        label: "Low",
        color: "bg-yellow-500/20 text-yellow-400",
      };

    return {
      label: "Healthy",
      color: "bg-green-500/20 text-green-400",
    };
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Inventory</h1>
        <p className="mt-2 text-slate-400">
          Live inventory synchronized with Supabase.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <Search size={18} className="text-slate-400" />

        <input
          className="w-full bg-transparent outline-none"
          placeholder="Search ingredient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left">Ingredient</th>
              <th className="px-6 py-4 text-left">Unit</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => {
              const status = getStatus(
                item.current_quantity,
                item.minimum_quantity
              );

              return (
                <tr
                  key={item.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="flex items-center gap-3 px-6 py-5">
                    <Package size={18} className="text-cyan-400" />
                    {item.name}
                  </td>

                  <td className="px-6 py-5">{item.unit}</td>

                  <td className="px-6 py-5">{item.current_quantity}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <AlertTriangle className="text-cyan-400" />
        <p>Inventory is updated directly from your database.</p>
      </div>
    </main>
  );
}