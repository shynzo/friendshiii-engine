import db from "../.."
import { matchesTable } from "../../schemas/matches"

export const addUserGroup = async (userId: number, groupId: number) => {
	await db.insert(matchesTable).values({
		groupId,
		userId,
	})
}
