import { and, eq } from "drizzle-orm"
import db from "../.."
import { matchesTable } from "../../schemas/matches"

export const existsInGroup = async (userId: number, groupId: number) => {
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
