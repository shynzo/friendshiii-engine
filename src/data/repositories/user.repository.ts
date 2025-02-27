import { and, eq, isNull } from "drizzle-orm"
import db from "@data/db"
import { usersTable } from "@data/schemas/user"

export class UserRepository {
	async create(data: typeof usersTable.$inferInsert) {
		const [user] = await db.insert(usersTable).values(data).returning()
		return user
	}

	async findById(id: string) {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(and(eq(usersTable.id, id), isNull(usersTable.deletedAt)))
		return user
	}

	async findByEmail(email: string) {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)))
		return user
	}

	async update(id: string, data: Partial<typeof usersTable.$inferInsert>) {
		const [user] = await db
			.update(usersTable)
			.set({ ...data, updatedAt: new Date().toISOString() })
			.where(eq(usersTable.id, id))
			.returning()
		return user
	}

	async softDelete(id: string) {
		const [user] = await db
			.update(usersTable)
			.set({
				deletedAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})
			.where(eq(usersTable.id, id))
			.returning()
		return user
	}

	async findActiveUsers({
		limit,
		offset,
	}: {
		limit: number
		offset: number
	}) {
		return db
			.select()
			.from(usersTable)
			.where(isNull(usersTable.deletedAt))
			.limit(limit)
			.offset(offset)
	}
}
