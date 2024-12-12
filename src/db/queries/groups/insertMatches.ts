import { and, eq, sql } from "drizzle-orm"
import db from "../.."
import { matchesTable } from "../../schemas/matches"
import { groupsTable } from "../../schemas/group"

export const insertMatches = async (
	matches: Map<number, number>,
	groupId: number,
) => {
	await db.transaction(async (tx) => {
		// Atualiza cada match individualmente ao invés de usar CASE
		for (const [userId, friendId] of matches.entries()) {
			await tx
				.update(matchesTable)
				.set({
					friendId,
					matchedAt: new Date().toISOString(),
				})
				.where(
					and(
						eq(matchesTable.groupId, groupId),
						eq(matchesTable.userId, userId),
					),
				)
		}

		// Atualiza o status do grupo
		await tx
			.update(groupsTable)
			.set({
				status: "drawed",
				drewAt: new Date().toISOString(),
			})
			.where(eq(groupsTable.id, groupId))
	})
}
