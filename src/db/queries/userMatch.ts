import { and, eq } from "drizzle-orm"
import db from ".."
import { matchesTable } from "../schemas/matches"
import { usersTable } from "../schemas/user"

const userMatch = async (userId: number, groupId: number) => {
	return await db
		.select({
			id: matchesTable.id,
			userId: matchesTable.userId,
			friendId: matchesTable.friendId,
			friendName: usersTable.name,
		})
		.from(matchesTable)
		.leftJoin(usersTable, eq(matchesTable.userId, usersTable.id))
		.where(
			and(eq(matchesTable.userId, userId), eq(matchesTable.groupId, groupId)),
		)
}
