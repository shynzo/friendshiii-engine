import { eq, or } from "drizzle-orm"
import db from "../../../data/db"
import { usersTable } from "../../../data/schemas/user"

export const getUser = async ({
	id,
	email,
	phone,
}: { id?: string; email?: string; phone?: string }) => {
	const [user] = await db
		.select()
		.from(usersTable)
		.where(
			or(
				id ? eq(usersTable.id, id) : undefined,
				email ? eq(usersTable.email, email) : undefined,
				phone ? eq(usersTable.phone, phone) : undefined,
			),
		)
		.limit(1)

	return user
}
