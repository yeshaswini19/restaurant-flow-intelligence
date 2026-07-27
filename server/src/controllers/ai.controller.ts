import { Request, Response } from "express";
import { generateInsights } from "../services/ai.service.js";
import { buildRestaurantContext } from "../services/restaurantContext.service.js";
import { supabase } from "../config/supabase.js";

export async function getAIInsights(
  _req: Request,
  res: Response
) {
  try {
    const context = await buildRestaurantContext();

    const insights = await generateInsights(context);

    const { data: orderItems } = await supabase
      .from("order_items")
      .select(`
        quantity,
        menu_items(
          name,
          price
        )
      `);

    const { data: inventory } = await supabase
      .from("inventory")
      .select(`
        current_quantity,
        ingredients(
          name
        )
      `);

    const dishSales: Record<string, number> = {};

    orderItems?.forEach((item: any) => {
      const dish = item.menu_items?.name ?? "Unknown";
      dishSales[dish] = (dishSales[dish] || 0) + Number(item.quantity);
    });

    const demandForecast = Object.entries(dishSales)
      .map(([dish, sold]) => ({
        dish,
        sold,
        predictedOrders: Math.ceil(Number(sold) * 1.2),
        trend:
          Number(sold) >= 10
            ? "High"
            : Number(sold) >= 5
            ? "Medium"
            : "Low",
      }))
      .sort((a, b) => b.predictedOrders - a.predictedOrders);

    const restocking = (inventory || [])
      .map((item: any) => ({
        ingredient: item.ingredients?.name,
        currentQuantity: Number(item.current_quantity),
        status:
          Number(item.current_quantity) <= 1
            ? "Critical"
            : Number(item.current_quantity) <= 5
            ? "Low"
            : "Healthy",
        suggestedRestock:
          Number(item.current_quantity) <= 1
            ? 25
            : Number(item.current_quantity) <= 5
            ? 15
            : 0,
      }))
      .filter(
        (item) =>
          item.status === "Critical" ||
          item.status === "Low"
      );

    const operationalInsights = [
      ...demandForecast.slice(0, 3).map((dish) => ({
        type: "Demand",
        message: `${dish.dish} is expected to receive approximately ${dish.predictedOrders} orders soon.`,
      })),
      ...restocking.map((item) => ({
        type: "Inventory",
        message: `${item.ingredient} stock is ${item.status}. Recommended restock: ${item.suggestedRestock} units.`,
      })),
    ];

    res.json({
      ...insights,
      demandForecast,
      restocking,
      operationalInsights,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate AI insights",
    });
  }
}