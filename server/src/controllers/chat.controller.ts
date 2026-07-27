import { Request, Response } from "express";
import { buildRestaurantContext } from "../services/restaurantContext.service.js";
import { askRestaurantAI } from "../services/chat.service.js";

export async function chatWithAI(
  req: Request,
  res: Response
) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        message: "Question is required.",
      });
    }

    const context = await buildRestaurantContext();

    const answer = await askRestaurantAI(question, context);

    res.json({
      answer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to process AI chat request.",
    });
  }
}