"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

type Ingredient = {
  id: string;
  name: string;
  unit: string;
};

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    unit: "",
  });

  const fetchIngredients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ingredients");
      const data = await res.json();
      setIngredients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const addIngredient = async () => {
    if (!form.name || !form.unit) return;

    await fetch("http://localhost:5000/api/ingredients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      unit: "",
    });

    fetchIngredients();
  };

  const deleteIngredient = async (id: string) => {
    await fetch(`http://localhost:5000/api/ingredients/${id}`, {
      method: "DELETE",
    });

    fetchIngredients();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Package size={24} />
          Ingredients
        </h2>

        <button
          onClick={addIngredient}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black"
        >
          <Plus size={18} />
          Save Ingredient
        </button>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <input
          placeholder="Ingredient Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-[#111c2b] p-4 outline-none"
        />

        <input
          placeholder="Unit (kg, pcs, litre...)"
          value={form.unit}
          onChange={(e) =>
            setForm({
              ...form,
              unit: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-[#111c2b] p-4 outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">Ingredient</th>
              <th className="p-4 text-left">Unit</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-6" colSpan={3}>
                  Loading...
                </td>
              </tr>
            ) : (
              ingredients.map((ingredient) => (
                <tr
                  key={ingredient.id}
                  className="border-t border-white/10"
                >
                  <td className="p-4">{ingredient.name}</td>

                  <td className="p-4">{ingredient.unit}</td>

                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button className="rounded-lg bg-amber-500 p-2">
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => deleteIngredient(ingredient.id)}
                        className="rounded-lg bg-red-500 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}