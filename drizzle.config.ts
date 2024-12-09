import { defineConfig } from "drizzle-kit"

export default defineConfig({
	out: "./src/db/migrations",
	dialect: "sqlite", // 'mysql' | 'sqlite' | 'turso'
	schema: "./src/db/schemas",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
})
