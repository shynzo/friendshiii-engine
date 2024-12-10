import { and, eq } from "drizzle-orm"
import db from "../.."
import { matchesTable } from "../../schemas/matches"
import { usersTable } from "../../schemas/user"

export const getUserMatch = async (userId: number, groupId: number) => {
	return await db
		.select({
			// Dados do match
			id: matchesTable.id,
			createdAt: matchesTable.createdAt,
			// Dados do amigo secreto
			friend: {
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				phone: usersTable.phone,
			},
		})
		.from(matchesTable)
		.leftJoin(usersTable, eq(usersTable.id, matchesTable.friendId))
		.where(
			and(eq(matchesTable.userId, userId), eq(matchesTable.groupId, groupId)),
		)
		.limit(1)
}
