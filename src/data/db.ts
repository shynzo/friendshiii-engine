import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite"
import { env } from "../lib/env"

const sqlite = new Database(env.DATABASE_URL)
const db = drizzle({
	client: sqlite,
})

export default db
