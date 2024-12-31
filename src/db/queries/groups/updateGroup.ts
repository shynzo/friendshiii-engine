import { eq } from "drizzle-orm"
import db from "../.."
import { groupsTable } from "../../schemas/group"

export const updateGroup = async ({
	id,
	name,
	description,
	eventDate,
	budget,
	maximumParticipants,
}: {
	id: string
	name?: string
	description?: string
	eventDate?: string
	budget?: number
	maximumParticipants?: number
}) => {
	const group = await db
		.update(groupsTable)
		.set({
			name,
			description,
			eventDate,
			budget,
			maximumParticipants,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(groupsTable.id, id))
		.returning({
			id: groupsTable.id,
			name: groupsTable.name,
			status: groupsTable.status,
			description: groupsTable.description,
			eventDate: groupsTable.eventDate,
			budget: groupsTable.budget,
			maximumParticipants: groupsTable.maximumParticipants,
		})

	return group
}
