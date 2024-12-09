import { eq } from "drizzle-orm"
import { usersTable } from "../schemas/user"
import { matchesTable } from "../schemas/matches"
import db from ".."

export const usersMatches = async (groupId: number) => {
	const friendSubquery = db
		.select({
			id: usersTable.id,
			name: usersTable.name,
		})
		.from(usersTable)
		.as("friend")

	return await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			friendId: matchesTable.friendId,
			friendName: friendSubquery.name,
		})
		.from(matchesTable)
		.leftJoin(usersTable, eq(matchesTable.userId, usersTable.id))
		.leftJoin(friendSubquery, eq(matchesTable.friendId, friendSubquery.id))
		.where(eq(matchesTable.groupId, groupId))
}
