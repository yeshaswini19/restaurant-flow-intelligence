import { supabase } from "../config/supabase.js";
import { RestaurantContext } from "../types/restaurant.js";

export async function buildRestaurantContext(): Promise<RestaurantContext> {
  // Inventory
  const { data: inventory, error: inventoryError } = await supabase
    .from("inventory")
    .select(`
      current_quantity,
      ingredient_id,
      ingredient:ingredients(
        id,
        name
      )
    `);

  if (inventoryError) throw inventoryError;

  // Menu
  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("*");

  if (menuError) throw menuError;

  // Orders
  const { data: orders, error: orderError } = await supabase
    .from("orders")
    .select("*");

  if (orderError) throw orderError;

  let availableDishes = 0;
  let unavailableDishes = 0;

  const unavailableMenu: string[] = [];
  const unavailableDishDetails: RestaurantContext["unavailableDishDetails"] = [];

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

    const missingIngredients: {
      ingredient: string;
      required: number;
      available: number;
    }[] = [];

    for (const r of recipe ?? []) {
      const ingredient = Array.isArray(r.ingredient)
        ? r.ingredient[0]
        : r.ingredient;

      const stock = inventory?.find(
        (i) => i.ingredient_id === ingredient.id
      );

      const availableQuantity = stock?.current_quantity ?? 0;

      if (availableQuantity < r.quantity_required) {
        available = false;

        missingIngredients.push({
          ingredient: ingredient.name,
          required: r.quantity_required,
          available: availableQuantity,
        });
      }
    }

    if (available) {
      availableDishes++;
    } else {
      unavailableDishes++;

      unavailableMenu.push(item.name);

      unavailableDishDetails.push({
        name: item.name,
        missingIngredients,
      });
    }
  }

  const lowStockIngredients =
    inventory
      ?.filter((item) => item.current_quantity <= 5)
      .map((item) => ({
        ingredient: Array.isArray(item.ingredient)
          ? item.ingredient[0]?.name
          : item.ingredient?.name,
        quantity: item.current_quantity,
      })) ?? [];

  return {
    restaurant: "KitchenPulse Demo",

    totalOrders: orders?.length ?? 0,

    inventory,

    availableDishes,

    unavailableDishes,

    unavailableMenu,

    unavailableDishDetails,

    lowStockIngredients,
  };
}