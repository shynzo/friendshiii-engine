import { and, eq } from "drizzle-orm"
import db from "../../../data/db"
import { matchesTable } from "../../../data/schemas/matches"

export const existsInGroup = async (userId: string, groupId: string) => {
	const [match] = await db
		.select()
		.from(matchesTable)
		.where(
			and(eq(matchesTable.userId, userId), eq(matchesTable.groupId, groupId)),
		)
		.limit(1)

	if (match) {
		return match
	}
	return null
}
