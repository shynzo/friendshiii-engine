import { z } from "zod"

const envSchema = z.object({
	DATABASE_URL: z.string(),
})

export const env = envSchema.parse(Bun.env)
