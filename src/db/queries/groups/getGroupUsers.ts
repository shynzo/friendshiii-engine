import { eq, sql } from "drizzle-orm"
import { usersTable } from "../../schemas/user"
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"
import db from "../.."
import { union } from "drizzle-orm/sqlite-core"

export const getGroupUsers = async (groupId: number) => {
	const participantsQuery = db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			phone: usersTable.phone,
			role: sql<string>`'participant'`.as("role"),
		})
		.from(matchesTable)
		.innerJoin(usersTable, eq(usersTable.id, matchesTable.userId))
		.where(eq(matchesTable.groupId, groupId))

	const ownerQuery = db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			phone: usersTable.phone,
			role: sql<string>`'owner'`.as("role"),
		})
		.from(groupsTable)
		.innerJoin(usersTable, eq(usersTable.id, groupsTable.ownerId))
		.where(eq(groupsTable.id, groupId))

	return await union(participantsQuery, ownerQuery)
}
