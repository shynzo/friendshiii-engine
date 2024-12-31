import { sql } from "drizzle-orm"
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"
import { usersTable } from "./user"
import { z } from "zod"
import { generateId } from "../../lib/helpers"

export const groupsTable = sqliteTable("groups", {
	id: text("id").primaryKey().notNull().$defaultFn(generateId),
	name: text("name").notNull(),
	description: text("description"),
	status: text("status", { enum: ["waiting", "drawn", "finished", "deleted"] })
		.default("waiting")
		.notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => usersTable.id),
	eventDate: text("event_date").notNull(),
	budget: real("budget"),
	maximumParticipants: integer("maximum_participants"),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: text("deleted_at"),
	drawnAt: text("drawn_at"),
})

export const insertGroupSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	ownerId: z.number().positive("ID do dono é obrigatório"),
	eventDate: z.string().datetime("A data do evento é obrigatória"),
})
