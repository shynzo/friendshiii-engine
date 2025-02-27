import { eq } from "drizzle-orm"
import db from "../../../data/db"
import { groupsTable } from "../../../data/schemas/group"

export const deleteGroup = async (id: string) => {
	const deletedGroup = await db
		.update(groupsTable)
		.set({
			status: "deleted",
			deletedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})
		.where(eq(groupsTable.id, id))
		.returning()

	return deletedGroup
}
