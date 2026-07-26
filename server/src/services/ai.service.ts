import { groq } from "../config/groq.js";

export async function generateInsights(data: any) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,

    messages: [
      {
        role: "system",
        content: `
You are KitchenPulse AI.

You are an expert restaurant operations consultant.

Always respond ONLY with valid JSON.

Return exactly:

{
  "healthScore": number,
  "summary": "",
  "risks": [],
  "opportunities": [],
  "recommendations": []
}
`,
      },

      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  return JSON.parse(
    completion.choices[0].message.content ?? "{}"
  );
}