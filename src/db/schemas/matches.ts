import { sql } from "drizzle-orm"
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { groupsTable } from "./group"
import { usersTable } from "./user"

export const matchesTable = sqliteTable("matches", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	groupId: integer("group_id")
		.notNull()
		.references(() => groupsTable.id),
	userId: integer("user_id")
		.notNull()
		.references(() => usersTable.id),
	friendId: integer("friend_id").references(() => usersTable.id),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
})
