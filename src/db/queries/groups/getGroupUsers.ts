import { eq, sql } from "drizzle-orm"
import { usersTable } from "../../schemas/user"
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"
import db from "../.."

export const getGroupUsers = async (groupId: number) => {
	const participantsQuery = db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			phone: usersTable.phone,
			role: sql<string>`CASE 
                WHEN ${usersTable.id} = ${groupsTable.ownerId} THEN 'owner'
                ELSE 'participant'
            END`.as("role"),
		})
		.from(matchesTable)
		.innerJoin(usersTable, eq(usersTable.id, matchesTable.userId))
		.innerJoin(groupsTable, eq(groupsTable.id, matchesTable.groupId))
		.where(eq(matchesTable.groupId, groupId))
	return await participantsQuery
}
