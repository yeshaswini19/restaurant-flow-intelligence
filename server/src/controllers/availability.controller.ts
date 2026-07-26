import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getAvailability = async (_req: Request, res: Response) => {
  try {
    // Get menu items
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("*");

    if (menuError) throw menuError;

    const result = [];

    for (const item of menuItems ?? []) {
      // Get recipe
      const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .select(
          `
          quantity_required,
          ingredient:ingredients(
            id,
            name
          )
        `
        )
        .eq("menu_item_id", item.id);

      if (recipeError) throw recipeError;

      let available = true;
      let missing: string[] = [];

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
          missing.push(ingredient.name);
        }
      }

      result.push({
        id: item.id,
        name: item.name,
        price: item.price,
        available,
        missingIngredients: missing,
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};