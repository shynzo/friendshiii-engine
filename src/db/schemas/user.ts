import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"

export const usersTable = sqliteTable("users", {
	id: integer("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone").notNull().unique(),
})

export const insertUserSchema = createInsertSchema(usersTable)
