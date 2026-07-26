import { Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { generateInsights } from "../services/ai.service.js";

export async function getAIInsights(
  _req: Request,
  res: Response
) {
  try {
    // Inventory
    const {
      data: inventory,
      error: inventoryError,
    } = await supabase
      .from("inventory")
      .select(`
        current_quantity,
        ingredient:ingredients(
          name
        )
      `);

    if (inventoryError) throw inventoryError;

    // Menu
    const {
      data: menuItems,
      error: menuError,
    } = await supabase
      .from("menu_items")
      .select("*");

    if (menuError) throw menuError;

    // Orders
    const {
      data: orders,
      error: orderError,
    } = await supabase
      .from("orders")
      .select("*");

    if (orderError) throw orderError;

    // Calculate availability using your existing recipes
    let availableDishes = 0;
    let unavailableDishes = 0;

    for (const item of menuItems ?? []) {
      const { data: recipe } = await supabase
        .from("recipes")
        .select(`
          quantity_required,
          ingredient:ingredients(
            id,
            name
          )
        `)
        .eq("menu_item_id", item.id);

      let available = true;

      for (const r of recipe ?? []) {
        const ingredient = Array.isArray(r.ingredient)
          ? r.ingredient[0]
          : r.ingredient;

        const { data: stock } = await supabase
          .from("inventory")
          .select("current_quantity")
          .eq("ingredient_id", ingredient.id)
          .single();

        if (!stock || stock.current_quantity < r.quantity_required) {
          available = false;
          break;
        }
      }

      if (available) {
        availableDishes++;
      } else {
        unavailableDishes++;
      }
    }

    console.log("Inventory:", inventory?.length);
    console.log("Menu:", menuItems?.length);
    console.log("Orders:", orders?.length);
    console.log("Available:", availableDishes);
    console.log("Unavailable:", unavailableDishes);

    const insights = await generateInsights({
      restaurant: "KitchenPulse Demo",

      inventory,

      totalOrders: orders?.length ?? 0,

      availableDishes,

      unavailableDishes,
    });

    res.json(insights);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate AI insights",
    });
  }
}