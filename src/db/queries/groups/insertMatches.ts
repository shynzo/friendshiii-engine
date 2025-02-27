import { and, eq, sql } from "drizzle-orm"
import db from "../../../data/db"
import { matchesTable } from "../../../data/schemas/matches"
import { groupsTable } from "../../../data/schemas/group"

export const insertMatches = async (
	matches: Map<string, string>,
	groupId: string,
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
				status: "drawn",
				drawnAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})
			.where(eq(groupsTable.id, groupId))
	})
}
