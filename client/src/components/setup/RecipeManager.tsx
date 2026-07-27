"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
} from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
};

type Ingredient = {
  id: string;
  name: string;
};

type Recipe = {
  id: string;
  menu_item_name: string;
  ingredient_name: string;
  quantity_required: number;
};

export default function RecipeManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [form, setForm] = useState({
    menu_item_id: "",
    ingredient_id: "",
    quantity_required: "",
  });

  const fetchData = async () => {
    const menuRes = await fetch("http://localhost:5000/menu");
    const menuJson = await menuRes.json();

    const ingredientRes = await fetch("http://localhost:5000/ingredients");
    const ingredientJson = await ingredientRes.json();

    const recipeRes = await fetch("http://localhost:5000/recipes");
    const recipeJson = await recipeRes.json();

    setMenuItems(menuJson.data || []);
    setIngredients(ingredientJson || []);
    setRecipes(recipeJson || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveRecipe = async () => {
    await fetch("http://localhost:5000/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menu_item_id: form.menu_item_id,
        ingredient_id: form.ingredient_id,
        quantity_required: Number(form.quantity_required),
      }),
    });

    setForm({
      menu_item_id: "",
      ingredient_id: "",
      quantity_required: "",
    });

    fetchData();
  };

  const deleteRecipe = async (id: string) => {
    await fetch(`http://localhost:5000/recipes/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <BookOpen size={24} />
          Recipe Builder
        </h2>

        <button
          onClick={saveRecipe}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black"
        >
          <Plus size={18} />
          Save Recipe
        </button>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <select
          value={form.menu_item_id}
          onChange={(e) =>
            setForm({
              ...form,
              menu_item_id: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-[#111c2b] p-4"
        >
          <option value="">Select Dish</option>

          {menuItems.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name}
            </option>
          ))}
        </select>

        <select
          value={form.ingredient_id}
          onChange={(e) =>
            setForm({
              ...form,
              ingredient_id: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-[#111c2b] p-4"
        >
          <option value="">Select Ingredient</option>

          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Quantity Required"
          value={form.quantity_required}
          onChange={(e) =>
            setForm({
              ...form,
              quantity_required: e.target.value,
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
              <th className="p-4 text-left">Ingredient</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {recipes.map((recipe) => (
              <tr
                key={recipe.id}
                className="border-t border-white/10"
              >
                <td className="p-4">{recipe.menu_item_name}</td>

                <td className="p-4">{recipe.ingredient_name}</td>

                <td className="p-4">{recipe.quantity_required}</td>

                <td className="p-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteRecipe(recipe.id)}
                      className="rounded-lg bg-red-500 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}