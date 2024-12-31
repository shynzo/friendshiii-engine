import db from "../.."
import { matchesTable } from "../../schemas/matches"
import { getGroupUsers } from "./getGroupUsers"

export const addUserGroup = async (userId: string, groupId: string) => {
	await db.insert(matchesTable).values({
		groupId,
		userId,
		joinedAt: new Date().toISOString(),
	})

	return await getGroupUsers(groupId)
}
