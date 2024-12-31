import { eq } from "drizzle-orm"
import { usersTable } from "../../schemas/user"
import db from "../.."

export const updateUser = async ({
	id,
	name,
	email,
	phone,
}: {
	id: string
	name?: string
	email?: string
	phone?: string
}) => {
	const user = await db
		.update(usersTable)
		.set({
			name,
			email,
			phone,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(usersTable.id, id))
		.returning({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			phone: usersTable.phone,
		})

	return user
}
