import { and, eq, or, sql } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"
import { alias } from "drizzle-orm/sqlite-core"
import { usersTable } from "../../schemas/user"

export const getUserGroups = async (userId: number) => {
	const friendTable = alias(usersTable, "friend")

	const groups = await db
		.select({
			id: groupsTable.id,
			name: groupsTable.name,
			status: groupsTable.status,
			createdAt: groupsTable.createdAt,
			eventDate: groupsTable.eventDate,
			role: sql`CASE WHEN ${groupsTable.ownerId} = ${userId} THEN 'owner' ELSE 'participant' END`,
			// Dados do match
			match: {
				id: matchesTable.id,
				friendName: friendTable.name,
				friendId: matchesTable.friendId,
				joinedAt: matchesTable.joinedAt,
				matchedAt: matchesTable.matchedAt,
			},
		})
		.from(groupsTable)
		.leftJoin(
			matchesTable,
			and(
				eq(matchesTable.groupId, groupsTable.id),
				eq(matchesTable.userId, userId),
			),
		)
		.leftJoin(friendTable, eq(friendTable.id, matchesTable.friendId))
		.where(or(eq(groupsTable.ownerId, userId), eq(matchesTable.userId, userId)))

	return groups
}
