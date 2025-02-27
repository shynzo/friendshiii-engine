import {
	sqliteTable,
	text,
	integer,
	real,
	index,
} from "drizzle-orm/sqlite-core"
import { generateId } from "../../lib/helpers"
import { usersTable } from "./user"

export const GroupStatus = {
	WAITING: "waiting",
	DRAWN: "drawn",
	FINISHED: "finished",
	DELETED: "deleted",
} as const

export type GroupStatus = (typeof GroupStatus)[keyof typeof GroupStatus]

export const groupsTable = sqliteTable(
	"groups",
	{
		id: text("id").primaryKey().notNull().$defaultFn(generateId),
		name: text("name").notNull(),
		description: text("description"),
		status: text("status", {
			enum: Object.values(GroupStatus) as [string, ...string[]],
		})
			.default(GroupStatus.WAITING)
			.notNull(),
		ownerId: text("owner_id")
			.notNull()
			.references(() => usersTable.id),
		eventDate: text("event_date").notNull(),
		budget: real("budget"),
		maximumParticipants: integer("maximum_participants"),
		theme: text("theme"),
		createdAt: text("created_at")
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text("updated_at")
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text("deleted_at"),
		drawnAt: text("drawn_at"),
	},
	(table) => ({
		ownerIdx: index("owner_idx").on(table.ownerId),
		statusIdx: index("status_idx").on(table.status),
	}),
)
