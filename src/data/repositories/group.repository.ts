import { groupsTable, GroupStatus } from "@data/schemas/group"
import db from "../db"
import { and, eq, isNull, sql } from "drizzle-orm"
import { usersTable } from "../schemas/user"
import { matchesTable } from "../schemas/matches"
import { alias } from "drizzle-orm/sqlite-core"

export class GroupRepository {
	private async findParticipants(groupId: string, requestingUserId?: string) {
		const friendTable = alias(usersTable, "friend")
		return db
			.select({
				id: usersTable.id,
				firstName: usersTable.firstName,
				lastName: usersTable.lastName,
				fullName:
					sql<string>`${usersTable.firstName} ${usersTable.lastName}`.as(
						"fullName",
					),
				email: usersTable.email,
				phone: usersTable.phone,
				role: sql<string>`CASE
          WHEN ${usersTable.id} = ${groupsTable.ownerId} THEN 'owner'
          ELSE 'participant'
        END`.as("role"),
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				friend: sql<any>`CASE
        WHEN ${matchesTable.userId} = ${requestingUserId} AND ${matchesTable.friendId} IS NOT NULL
        THEN json_object(
          'id', ${friendTable.id},
          'firstName', ${friendTable.firstName},
          'lastName', ${friendTable.lastName},
          'fullName', ${friendTable.firstName} || ' ' || ${friendTable.lastName},
          'email', ${friendTable.email},
          'phone', ${friendTable.phone}
        )
        ELSE NULL
      END`.as("friend"),
			})
			.from(matchesTable)
			.innerJoin(usersTable, eq(usersTable.id, matchesTable.userId))
			.innerJoin(groupsTable, eq(groupsTable.id, matchesTable.groupId))
			.leftJoin(friendTable, eq(matchesTable.friendId, friendTable.id))
			.where(eq(matchesTable.groupId, groupId))
	}

	private async withParticipants(
		groups: (typeof groupsTable.$inferSelect)[],
		requestingUserId?: string,
	) {
		const enrichedGroups = await Promise.all(
			groups.map(async (group) => ({
				...group,
				participants: await this.findParticipants(group.id, requestingUserId),
			})),
		)
		return enrichedGroups
	}

	async create(data: typeof groupsTable.$inferInsert) {
		const [group] = await db.insert(groupsTable).values(data).returning()

		return group
	}

	async findById(id: string) {
		const [group] = await db
			.select()
			.from(groupsTable)
			.where(and(eq(groupsTable.id, id), isNull(groupsTable.deletedAt)))

		if (!group) return null

		return this.withParticipants([group]).then(([group]) => group)
	}

	async findByOwnerId(ownerId: string) {
		const groups = await db
			.select()
			.from(groupsTable)
			.where(
				and(eq(groupsTable.ownerId, ownerId), isNull(groupsTable.deletedAt)),
			)

		if (!groups) return null

		return await this.withParticipants(groups)
	}

	async findGroupsByStatus(status: GroupStatus) {
		const groups = await db
			.select()
			.from(groupsTable)
			.where(eq(groupsTable.status, status))

		return this.withParticipants(groups)
	}

	async findUserGroups(userId: string) {
		const groups = await db
			.selectDistinct({
				group: groupsTable,
			})
			.from(matchesTable)
			.innerJoin(groupsTable, eq(groupsTable.id, matchesTable.groupId))
			.where(
				and(eq(matchesTable.userId, userId), isNull(groupsTable.deletedAt)),
			)

		return this.withParticipants(
			groups.map(({ group }) => group),
			userId, // passa o userId para mostrar o amigo secreto
		)
	}

	async update(id: string, data: Partial<typeof groupsTable.$inferInsert>) {
		const [group] = await db
			.update(groupsTable)
			.set({ ...data, updatedAt: new Date().toISOString() })
			.where(eq(groupsTable.id, id))
			.returning()

		return this.withParticipants([group]).then(([group]) => group)
	}

	async updateStatus(id: string, status: GroupStatus) {
		const [group] = await db
			.update(groupsTable)
			.set({
				status,
				updatedAt: new Date().toISOString(),
				...(status === "drawn" ? { drawnAt: new Date().toISOString() } : {}),
			})
			.where(eq(groupsTable.id, id))
			.returning()

		return this.withParticipants([group]).then(([group]) => group)
	}

	async softDelete(id: string) {
		const [group] = await db
			.update(groupsTable)
			.set({
				status: GroupStatus.DELETED,
				deletedAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})
			.where(eq(groupsTable.id, id))
			.returning()

		return this.withParticipants([group]).then(([group]) => group)
	}
}
