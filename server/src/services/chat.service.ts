import { groq } from "../config/groq.js";
import { RestaurantContext } from "../types/restaurant.js";

function buildForecast(context: RestaurantContext) {
  const menu: any[] = (context as any).menuItems ?? [];
  const inventory: any[] = (context as any).inventory ?? [];
  const orders: any[] = (context as any).orders ?? [];

  const dishSales: Record<string, number> = {};

  orders.forEach((order: any) => {
    (order.items ?? []).forEach((item: any) => {
      dishSales[item.menu_item_name] =
        (dishSales[item.menu_item_name] ?? 0) +
        Number(item.quantity ?? 0);
    });
  });

  const demandForecast = Object.entries(dishSales)
    .map(([dish, sold]) => ({
      dish,
      sold,
      predicted: Math.ceil(Number(sold) * 1.2),
    }))
    .sort((a, b) => b.predicted - a.predicted)
    .slice(0, 5);

  const lowStock = inventory
    .filter((item: any) => Number(item.current_quantity) <= 5)
    .map((item: any) => ({
      ingredient: item.ingredient_name,
      current: item.current_quantity,
      recommendation:
        Number(item.current_quantity) <= 1
          ? "Restock immediately"
          : "Restock soon",
    }));

  return {
    demandForecast,
    lowStock,
    totalOrders: orders.length,
    totalMenuItems: menu.length,
  };
}

export async function askRestaurantAI(
  question: string,
  context: RestaurantContext
) {
  const forecast = buildForecast(context);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,

    messages: [
      {
        role: "system",
        content: `
You are KitchenPulse AI.

You are an expert restaurant operations assistant.

You MUST answer only from the supplied restaurant data and forecasting summary.

Capabilities:
- Inventory analysis
- Recipe availability
- Demand forecasting
- Restocking recommendations
- Restaurant health summary
- Operational insights

Rules:
- Never invent facts.
- Never fabricate numbers.
- If data is unavailable, clearly state that.
- Prefer bullet points when useful.
- Keep responses concise and actionable.
`,
      },
      {
        role: "user",
        content: `
Restaurant Data

${JSON.stringify(context, null, 2)}

Forecast

${JSON.stringify(forecast, null, 2)}

Question

${question}
`,
      },
    ],
  });

  return completion.choices[0].message.content ?? "No response.";
}