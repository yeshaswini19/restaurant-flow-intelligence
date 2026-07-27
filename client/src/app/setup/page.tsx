"use client";

import { useState } from "react";
import {
  Package,
  ChefHat,
  BookOpen,
} from "lucide-react";

import IngredientManager from "@/components/setup/IngredientManager";
import MenuManager from "@/components/setup/MenuManager";
import RecipeManager from "@/components/setup/RecipeManager";

export default function RestaurantSetupPage() {
  const [activeTab, setActiveTab] = useState("ingredients");

  const tabs = [
    {
      id: "ingredients",
      label: "Ingredients",
      icon: Package,
    },
    {
      id: "menu",
      label: "Menu",
      icon: ChefHat,
    },
    {
      id: "recipes",
      label: "Recipes",
      icon: BookOpen,
    },
  ];

  return (
    <main className="min-h-screen bg-[#08111f] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Restaurant Setup
          </h1>

          <p className="mt-2 text-slate-400">
            Configure your restaurant's ingredients, menu and recipes.
          </p>
        </div>

        <div className="mb-8 flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 transition ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-black"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "ingredients" && <IngredientManager />}

        {activeTab === "menu" && <MenuManager />}

        {activeTab === "recipes" && <RecipeManager />}
      </div>
    </main>
  );
}