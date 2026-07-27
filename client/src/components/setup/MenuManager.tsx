"use client";

import { useEffect, useState } from "react";
import {
  ChefHat,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
};

export default function MenuManager() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:5000/menu");
      const json = await res.json();
      setMenu(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addDish = async () => {
    if (!form.name || !form.price) return;

    await fetch("http://localhost:5000/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
      }),
    });

    setForm({
      name: "",
      description: "",
      price: "",
    });

    fetchMenu();
  };

  const deleteDish = async (id: string) => {
    await fetch(`http://localhost:5000/menu/${id}`, {
      method: "DELETE",
    });

    fetchMenu();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <ChefHat size={24} />
          Menu Management
        </h2>

        <button
          onClick={addDish}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black"
        >
          <Plus size={18} />
          Save Dish
        </button>
      </div>

      <div className="mb-8 grid gap-5">
        <input
          placeholder="Dish Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-[#111c2b] p-4"
        />

        <textarea
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-[#111c2b] p-4"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-[#111c2b] p-4"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">Dish</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-6" colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : (
              menu.map((dish) => (
                <tr
                  key={dish.id}
                  className="border-t border-white/10"
                >
                  <td className="p-4">
                    <div className="font-semibold">
                      {dish.name}
                    </div>

                    <div className="text-sm text-slate-400">
                      {dish.description}
                    </div>
                  </td>

                  <td className="p-4">₹{dish.price}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        dish.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {dish.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button className="rounded-lg bg-amber-500 p-2">
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => deleteDish(dish.id)}
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