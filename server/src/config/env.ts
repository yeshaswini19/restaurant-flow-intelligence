import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  SUPABASE_URL: z.url(),

  SUPABASE_ANON_KEY: z.string().min(1),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  GROQ_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;