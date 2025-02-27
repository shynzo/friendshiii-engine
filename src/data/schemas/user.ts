import { sqliteTable, text, index } from "drizzle-orm/sqlite-core"
import { generateId } from "../../lib/helpers"

export const usersTable = sqliteTable(
	"users",
	{
		id: text("id").primaryKey().notNull().$defaultFn(generateId),
		firstName: text("first_name").notNull(),
		lastName: text("last_name").notNull(),
		email: text("email").notNull().unique(),
		phone: text("phone").notNull().unique(),
		createdAt: text("created_at")
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text("updated_at")
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text("deleted_at"),
	},
	(table) => ({
		emailIdx: index("email_idx").on(table.email),
		phoneIdx: index("phone_idx").on(table.phone),
	}),
)
