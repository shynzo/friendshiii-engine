import { and, eq, or } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"

export const getUserGroups = async (userId: number) => {
	const groups = await db
		.select({
			id: groupsTable.id,
			name: groupsTable.name,
			status: groupsTable.status,
			createdAt: groupsTable.createdAt,
			eventDate: groupsTable.eventDate,
			// Dados do match
			match: {
				id: matchesTable.id,
				friendId: matchesTable.friendId,
				createdAt: matchesTable.createdAt,
			},
		})
		.from(groupsTable)
		.leftJoin(matchesTable, eq(matchesTable.groupId, groupsTable.id))
		.where(
			or(
				and(eq(groupsTable.ownerId, userId), eq(groupsTable.status, "drawed")),
				eq(matchesTable.userId, userId),
			),
		)

	return groups
}
