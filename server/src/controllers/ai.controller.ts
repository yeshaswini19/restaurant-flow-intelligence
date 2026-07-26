import { Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { generateInsights } from "../services/ai.service.js";

export async function getAIInsights(
  req: Request,
  res: Response
) {
  try {
    const { data: inventory } = await supabase
      .from("inventory")
      .select(`
        current_quantity,
        ingredients(name)
      `);

    const { count: orders } = await supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      });

    const insights = await generateInsights({
      ordersToday: orders ?? 0,
      inventory,
    });

    res.json(insights);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate AI insights",
    });
  }
}