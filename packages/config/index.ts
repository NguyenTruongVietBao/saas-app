import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  RABBITMQ_URL: z.string(),

  JWT_SECRET: z.string(),

  NEXT_PUBLIC_APP_URL: z.string().url(),
  API_URL: z.string().url(),

  DEFAULT_LOCALE: z.string().default("en"),
});

export const env = envSchema.parse(process.env);
