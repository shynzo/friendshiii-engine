import { eq } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"
import { getGroup } from "./getGroup"

export const deleteGroup = async (id: string) => {
	const group = await getGroup(id)

	if (!group) {
		return null
	}

	const deletedGroup = await db
		.update(groupsTable)
		.set({
			status: "deleted",
			deletedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})
		.where(eq(groupsTable.id, id))

	return deletedGroup
}
