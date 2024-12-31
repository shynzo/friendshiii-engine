import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { groupsTable } from "./group"
import { usersTable } from "./user"
import { generateId } from "../../lib/helpers"

export const matchesTable = sqliteTable("matches", {
	id: text("id").primaryKey().notNull().$defaultFn(generateId),
	groupId: text("group_id")
		.notNull()
		.references(() => groupsTable.id),
	userId: text("user_id")
		.notNull()
		.references(() => usersTable.id),
	friendId: text("friend_id").references(() => usersTable.id),
	joinedAt: text("joined_at"),
	matchedAt: text("matched_at"),
})
