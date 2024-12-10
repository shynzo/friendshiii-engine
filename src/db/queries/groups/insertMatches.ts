import { eq, sql } from "drizzle-orm"
import db from "../.."
import { matchesTable } from "../../schemas/matches"
import { groupsTable } from "../../schemas/group"

export const insertMatches = async (
	matches: Map<number, number>,
	groupId: number,
) => {
	await db.transaction(async (tx) => {
		const cases = Array.from(matches.entries()).map(
			([userId, friendId]) =>
				sql`WHEN (userId = ${userId} AND groupId = ${groupId}) THEN ${friendId}`,
		)

		await tx
			.update(matchesTable)
			.set({
				friendId: sql`CASE ${sql.join(cases, " ")} ELSE friendId END`,
			})
			.where(eq(matchesTable.groupId, groupId))

		await tx
			.update(groupsTable)
			.set({ status: "drawed", drawAt: new Date().toISOString() })
			.where(eq(groupsTable.id, groupId))
	})
}
