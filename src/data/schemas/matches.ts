import { sqliteTable, text, index } from "drizzle-orm/sqlite-core"
import { groupsTable } from "./group"
import { usersTable } from "./user"
import { generateId } from "../../lib/helpers"

export const matchesTable = sqliteTable(
	"matches",
	{
		id: text("id").primaryKey().notNull().$defaultFn(generateId),
		groupId: text("group_id")
			.notNull()
			.references(() => groupsTable.id),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id),
		friendId: text("friend_id").references(() => usersTable.id),
		joinedAt: text("joined_at")
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		matchedAt: text("matched_at"),
	},
	(table) => ({
		groupIdx: index("group_idx").on(table.groupId),
		userIdx: index("user_idx").on(table.userId),
		friendIdx: index("friend_idx").on(table.friendId),
	}),
)
