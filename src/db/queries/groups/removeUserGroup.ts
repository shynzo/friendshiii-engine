import { and, eq } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"

export const removeUserGroup = async (userId: string, groupId: string) => {
	await db.transaction(async (tx) => {
		await tx
			.delete(matchesTable)
			.where(
				and(eq(matchesTable.userId, userId), eq(matchesTable.groupId, groupId)),
			)

		tx.update(matchesTable)
			.set({
				friendId: null,
				matchedAt: null,
			})
			.where(eq(matchesTable.groupId, groupId))

		tx.update(groupsTable)
			.set({
				status: "waiting",
				updatedAt: new Date().toISOString(),
			})
			.where(eq(groupsTable.id, groupId))
	})
}
