import db from "../.."
import { usersTable } from "../../schemas/user"

export const createUser = async ({
	name,
	email,
	phone,
}: { name: string; email: string; phone: string }) => {
	const [user] = await db
		.insert(usersTable)
		.values({
			name,
			email,
			phone,
			updateAt: new Date().toISOString(),
		})
		.returning({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			phone: usersTable.phone,
		})

	return user
}
