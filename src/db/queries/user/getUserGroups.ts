import { and, desc, eq, or, sql } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"
import { alias } from "drizzle-orm/sqlite-core"
import { usersTable } from "../../schemas/user"
import { getGroupUsers } from "../groups/getGroupUsers"

export const getUserGroups = async (userId: string) => {
	const friendTable = alias(usersTable, "friend")

	const groups = await db
		.select({
			id: groupsTable.id,
			name: groupsTable.name,
			status: groupsTable.status,
			description: groupsTable.description,
			createdAt: groupsTable.createdAt,
			eventDate: groupsTable.eventDate,
			budget: groupsTable.budget,
			role: sql`CASE WHEN ${groupsTable.ownerId} = ${userId} THEN 'owner' ELSE 'participant' END`,
			joinedAt: matchesTable.joinedAt,
			// Dados do match
			match: {
				friendName: friendTable.name,
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
		.orderBy(desc(groupsTable.createdAt))

	const groupsWithParticipants = await Promise.all(
		groups.map(async (group) => {
			const participants = await getGroupUsers(group.id)
			return {
				...group,
				participants,
			}
		}),
	)

	return groupsWithParticipants
}
