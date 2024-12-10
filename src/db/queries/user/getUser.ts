import { eq, or } from "drizzle-orm"
import db from "../.."
import { usersTable } from "../../schemas/user"

export const getUser = async ({
	id,
	email,
	phone,
}: { id?: number; email?: string; phone?: string }) => {
	return await db
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
}
