import { eq } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"

export const getGroup = async (id: number) => {
	return await db
		.select()
		.from(groupsTable)
		.where(eq(groupsTable.id, id))
		.limit(1)
}
