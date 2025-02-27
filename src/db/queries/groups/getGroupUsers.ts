import { eq, sql } from "drizzle-orm"
import { usersTable } from "../../../data/schemas/user"
import { groupsTable } from "../../../data/schemas/group"
import { matchesTable } from "../../../data/schemas/matches"
import db from "../../../data/db"

export const getGroupUsers = async (groupId: string) => {
	const participants = db
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
	return await participants
}
