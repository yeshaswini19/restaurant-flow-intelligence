import { groq } from "../config/groq.js";
import { RestaurantContext } from "../types/restaurant.js";

export async function askRestaurantAI(
  question: string,
  context: RestaurantContext
) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,

    messages: [
      {
        role: "system",
        content: `
You are KitchenPulse AI.

You are an expert restaurant operations assistant.

Rules:
- Answer ONLY using the provided restaurant data.
- If the answer cannot be determined from the data, say so.
- Be concise and practical.
- Do not invent numbers or facts.
`,
      },
      {
        role: "user",
        content: `
Restaurant Data:
${JSON.stringify(context, null, 2)}

Question:
${question}
`,
      },
    ],
  });

  return completion.choices[0].message.content ?? "No response.";
}