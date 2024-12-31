import db from "../.."
import { groupsTable } from "../../schemas/group"
import { matchesTable } from "../../schemas/matches"

export const createGroup = async ({
	name,
	ownerId,
	eventDate,
	budget,
	maximumParticipants,
	description,
}: {
	name: string
	ownerId: string
	eventDate: string
	budget: number
	maximumParticipants: number
	description?: string
}) => {
	const [group] = await db
		.insert(groupsTable)
		.values({
			name,
			ownerId,
			eventDate,
			budget,
			maximumParticipants,
			description,
		})
		.returning({
			id: groupsTable.id,
			name: groupsTable.name,
			description: groupsTable.description,
			ownerId: groupsTable.ownerId,
			status: groupsTable.status,
			eventDate: groupsTable.eventDate,
			budget: groupsTable.budget,
			maximumParticipants: groupsTable.maximumParticipants,
			createdAt: groupsTable.createdAt,
		})

	await db.insert(matchesTable).values({
		groupId: group.id,
		userId: ownerId,
		joinedAt: new Date().toISOString(),
	})

	return group
}
