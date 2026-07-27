import { Request, Response } from "express";
import { generateInsights } from "../services/ai.service.js";
import { buildRestaurantContext } from "../services/restaurantContext.service.js";

export async function getAIInsights(
  _req: Request,
  res: Response
) {
  try {
    const context = await buildRestaurantContext();

    const insights = await generateInsights(context);

    res.json(insights);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate AI insights",
    });
  }
}