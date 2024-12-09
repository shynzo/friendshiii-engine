import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { usersTable } from "./user"
import { createInsertSchema } from "drizzle-zod"

export const groupsTable = sqliteTable("groups", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	name: text("name").notNull(),
	status: text("status", { enum: ["waiting", "drawed", "finished"] })
		.default("waiting")
		.notNull(),
	ownerId: integer("owner_id")
		.notNull()
		.references(() => usersTable.id),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	drawAt: text("draw_count"),
	eventDate: text("event_date"),
})

export const insertGroupValidator = createInsertSchema(groupsTable)