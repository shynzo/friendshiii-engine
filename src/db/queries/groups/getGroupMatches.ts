import { eq } from "drizzle-orm"
import db from "../.."
import { matchesTable } from "../../schemas/matches"
import { usersTable } from "../../schemas/user"
import { alias } from "drizzle-orm/sqlite-core"

export const getGroupMatches = async (groupId: string) => {
	const friendTable = alias(usersTable, "friend")

	return await db
		.select({
			id: matchesTable.id,
			matchedAt: matchesTable.matchedAt,
			// Dados do participante
			participant: {
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				phone: usersTable.phone,
			},
			// Dados do amigo sorteado
			friend: {
				id: friendTable.id,
				name: friendTable.name,
				email: friendTable.email,
				phone: friendTable.phone,
			},
		})
		.from(matchesTable)
		.innerJoin(usersTable, eq(usersTable.id, matchesTable.userId))
		.leftJoin(friendTable, eq(friendTable.id, matchesTable.friendId))
		.where(eq(matchesTable.groupId, groupId))
}
