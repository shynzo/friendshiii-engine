import { eq } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"
import { getGroupUsers } from "./getGroupUsers"

export const getGroup = async (id: string) => {
	const [group] = await db
		.select()
		.from(groupsTable)
		.where(eq(groupsTable.id, id))
		.limit(1)

	if (group) {
		const participants = await getGroupUsers(id)
		return {
			...group,
			participants,
		}
	}

	return null
}
