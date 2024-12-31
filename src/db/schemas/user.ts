import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"
import { generateId } from "../../lib/helpers"

export const usersTable = sqliteTable("users", {
	id: text("id").primaryKey().notNull().$defaultFn(generateId),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone").notNull().unique(),
	createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
	updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
	deletedAt: text("deleted_at"),
})

export const insertUserSchema = createInsertSchema(usersTable, {
	name: (schema) =>
		schema.name.min(4, "Nome é obrigatório").max(50, "Nome inválido"),
	email: (schema) => schema.email.min(1, "Email é obrigatório").email(),
	phone: (schema) =>
		schema.phone
			.min(1, "Telefone é obrigatório")
			.max(11, "Telefone inválido")
			.regex(/^\d{11}$/, "Telefone inválido"),
})
