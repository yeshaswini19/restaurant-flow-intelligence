import { groq } from "../config/groq.js";
import { RestaurantContext } from "../types/restaurant.js";

export async function generateInsights(
  data: RestaurantContext
) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,

    messages: [
      {
        role: "system",
        content: `
You are KitchenPulse AI, an enterprise restaurant operations assistant.

You analyze restaurant operations using inventory, menu availability and order information.

Rules:

- Base every insight ONLY on the supplied data.
- Never invent ingredients, dishes or numbers.
- Explain WHY each recommendation is being made.
- Prioritize operational issues over generic business advice.
- If inventory is healthy, mention positive observations.
- If dishes are unavailable, explain the likely inventory reason.
- Keep the summary concise (maximum 2 sentences).

Return ONLY valid JSON in exactly this format:

{
  "healthScore": 0,
  "summary": "",
  "risks": [
    ""
  ],
  "opportunities": [
    ""
  ],
  "recommendations": [
    ""
  ]
}
`,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  return JSON.parse(content);
}