import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const usersTable = sqliteTable("users", {
	id: integer("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone").notNull().unique(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updateAt: text("update_at").default(sql`CURRENT_TIMESTAMP`),
})

export const insertUserSchema = createInsertSchema(usersTable, {
	name: (schema) => schema.name.min(1, "Nome é obrigatório"),
	email: (schema) => schema.email.min(1, "Email é obrigatório"),
	phone: (schema) =>
		schema.phone.min(1, "Telefone é obrigatório").max(11, "Telefone inválido"),
})
