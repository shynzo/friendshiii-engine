import db from "."
import { groupsTable } from "./schemas/group"
import { matchesTable } from "./schemas/matches"
import { usersTable } from "./schemas/user"

const main = async () => {
	console.log("Seeding...")
	try {
		await db.delete(usersTable)
		await db.delete(groupsTable)
		await db.delete(matchesTable)

		await db.insert(usersTable).values([
			{
				id: 1,
				name: "John",
				email: "john@example.com",
				phone: "+1 (555) 555-5555",
			},
			{
				id: 2,
				name: "Jane",
				email: "jane@example.com",
				phone: "+1 (555) 555-5556",
			},
			{
				id: 3,
				name: "Bob",
				email: "bob@example.com",
				phone: "+1 (555) 555-5557",
			},
			{
				id: 4,
				name: "Alice",
				email: "alice@example.com",
				phone: "+1 (555) 555-5558",
			},
		])

		await db.insert(groupsTable).values([
			{
				id: 1,
				name: "Group 1",
				ownerId: 1,
				status: "waiting",
				eventDate: new Date("2023-01-01").toISOString(),
			},
		])

		await db.insert(matchesTable).values([
			{ id: 1, groupId: 1, userId: 1 },
			{ id: 2, groupId: 1, userId: 2 },
			{ id: 3, groupId: 1, userId: 3 },
			{ id: 4, groupId: 1, userId: 4 },
		])

		console.log("Seeding complete!")
	} catch (error) {
		console.error(error)
	}
}

main()
