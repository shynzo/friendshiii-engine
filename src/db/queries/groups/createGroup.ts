import db from "../.."
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"

export const createGroup = async (
	name: string,
	ownerId: number,
	eventDate?: string,
) => {
	const [group] = await db
		.insert(groupsTable)
		.values({
			name,
			ownerId,
			status: "waiting",
			eventDate: eventDate ?? undefined,
		})
		.returning({
			id: groupsTable.id,
			name: groupsTable.name,
			ownerId: groupsTable.ownerId,
			status: groupsTable.status,
			eventDate: groupsTable.eventDate,
		})

	await db.insert(matchesTable).values([{ groupId: group.id, userId: ownerId }])

	return group
}
