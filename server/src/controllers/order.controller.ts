import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

    // Get recipe
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .select("*")
      .eq("menu_item_id", menuItemId);

    if (recipeError) throw recipeError;

    // Check inventory
    for (const item of recipe ?? []) {
      const { data: stock } = await supabase
        .from("inventory")
        .select("*")
        .eq("ingredient_id", item.ingredient_id)
        .single();

      if (!stock || stock.current_quantity < item.quantity_required * quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient inventory",
        });
      }
    }

    // Deduct inventory
    for (const item of recipe ?? []) {
      const { data: stock } = await supabase
        .from("inventory")
        .select("*")
        .eq("ingredient_id", item.ingredient_id)
        .single();

      await supabase
        .from("inventory")
        .update({
          current_quantity:
            stock.current_quantity - item.quantity_required * quantity,
        })
        .eq("ingredient_id", item.ingredient_id);

      await supabase.from("inventory_transactions").insert({
        ingredient_id: item.ingredient_id,
        transaction_type: "ORDER",
        quantity: item.quantity_required * quantity,
      });
    }

    const { data: order } = await supabase
      .from("orders")
      .insert({
        restaurant_id: "11111111-1111-1111-1111-111111111111",
        status: "completed",
      })
      .select()
      .single();

    await supabase.from("order_items").insert({
      order_id: order.id,
      menu_item_id: menuItemId,
      quantity,
    });

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};