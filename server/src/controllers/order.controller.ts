import { Request, Response } from "express";
import { supabase } from "../config/supabase";

const RESTAURANT_ID = "11111111-1111-1111-1111-111111111111";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        message: "menuItemId is required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Get menu item
    const { data: menuItem, error: menuError } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", menuItemId)
      .single();

    if (menuError || !menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Get recipe
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .select("*")
      .eq("menu_item_id", menuItemId);

    if (recipeError) throw recipeError;

    if (!recipe || recipe.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe not found for this menu item",
      });
    }

    const inventoryChanges: any[] = [];

    // Validate inventory
    for (const ingredient of recipe) {
      const { data: stock, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("ingredient_id", ingredient.ingredient_id)
        .single();

      if (error || !stock) {
        return res.status(400).json({
          success: false,
          message: "Ingredient inventory not found",
        });
      }

      const required = ingredient.quantity_required * quantity;

      if (stock.current_quantity < required) {
        return res.status(400).json({
          success: false,
          message: `${stock.name ?? "Ingredient"} is out of stock`,
          ingredient: stock,
          required,
          available: stock.current_quantity,
        });
      }

      inventoryChanges.push({
        ingredient,
        stock,
        required,
      });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: RESTAURANT_ID,
        status: "completed",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order item
    const { error: orderItemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        menu_item_id: menuItemId,
        quantity,
      });

    if (orderItemError) throw orderItemError;

    // Deduct inventory
for (const change of inventoryChanges) {
  const remaining =
    Number(change.stock.current_quantity) -
    Number(change.required);

  const newQuantity = Math.max(0, remaining);

  const { error: updateError } = await supabase
    .from("inventory")
    .update({
      current_quantity: newQuantity,
    })
    .eq("ingredient_id", change.ingredient.ingredient_id);

  if (updateError) throw updateError;

  await supabase.from("inventory_transactions").insert({
    ingredient_id: change.ingredient.ingredient_id,
    transaction_type: "ORDER",
    quantity: change.required,
  });
}

    // Recalculate dish availability
    const { data: allMenuItems } = await supabase
      .from("menu_items")
      .select("id");

    for (const dish of allMenuItems ?? []) {
      const { data: dishRecipe } = await supabase
        .from("recipes")
        .select("*")
        .eq("menu_item_id", dish.id);

      let available = true;

      for (const ingredient of dishRecipe ?? []) {
        const { data: stock } = await supabase
          .from("inventory")
          .select("current_quantity")
          .eq("ingredient_id", ingredient.ingredient_id)
          .single();

        if (
          !stock ||
          stock.current_quantity < ingredient.quantity_required
        ) {
          available = false;
          break;
        }
      }

      await supabase
        .from("menu_items")
        .update({
          is_available: available,
        })
        .eq("id", dish.id);
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error,
    });
  }
};