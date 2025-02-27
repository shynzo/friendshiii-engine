import { and, eq } from "drizzle-orm"
import db from "../../../data/db"
import { groupsTable } from "../../../data/schemas/group"
import { matchesTable } from "../../../data/schemas/matches"

export const removeUserGroup = async (userId: string, groupId: string) => {
	await db.transaction(async (tx) => {
		const [group] = await tx
			.select()
			.from(groupsTable)
			.where(eq(groupsTable.id, groupId))
			.limit(1)

		await tx
			.delete(matchesTable)
			.where(
				and(eq(matchesTable.userId, userId), eq(matchesTable.groupId, groupId)),
			)

		if (group.status === "drawn") {
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
		}
	})
}
