// src/data/repositories/match.repository.ts
import { eq, isNull, and, sql } from "drizzle-orm"
import db from "@data/db"
import { matchesTable } from "@data/schemas/matches"
import { usersTable } from "@data/schemas/user"

export class MatchRepository {
	async joinGroup(groupId: string, userId: string) {
		const [match] = await db
			.insert(matchesTable)
			.values({
				groupId,
				userId,
				joinedAt: new Date().toISOString(),
			})
			.returning()
		return match
	}

	async removeFromGroup(groupId: string, userId: string) {
		const [match] = await db
			.delete(matchesTable)
			.where(
				and(eq(matchesTable.groupId, groupId), eq(matchesTable.userId, userId)),
			)
			.returning()
		return match
	}

	async findGroupMatches(groupId: string) {
		return db
			.select({
				id: matchesTable.id,
				userId: usersTable.id,
				userFirstName: usersTable.firstName,
				userLastName: usersTable.lastName,
				userFullName:
					sql<string>`${usersTable.firstName} ${usersTable.lastName}`.as(
						"userFullName",
					),
				userEmail: usersTable.email,
				userPhone: usersTable.phone,
				friendId: matchesTable.friendId,
				joinedAt: matchesTable.joinedAt,
				matchedAt: matchesTable.matchedAt,
			})
			.from(matchesTable)
			.innerJoin(usersTable, eq(usersTable.id, matchesTable.userId))
			.where(eq(matchesTable.groupId, groupId))
	}

	async findUserMatches(userId: string) {
		return db
			.select({
				matchId: matchesTable.id,
				groupId: matchesTable.groupId,
				friendId: matchesTable.friendId,
				joinedAt: matchesTable.joinedAt,
				matchedAt: matchesTable.matchedAt,
			})
			.from(matchesTable)
			.where(eq(matchesTable.userId, userId))
	}

	async isUserInGroup(groupId: string, userId: string) {
		const [match] = await db
			.select()
			.from(matchesTable)
			.where(
				and(eq(matchesTable.groupId, groupId), eq(matchesTable.userId, userId)),
			)
		return !!match
	}

	async updateFriend(matchId: string, friendId: string | null) {
		const [match] = await db
			.update(matchesTable)
			.set({
				friendId,
				matchedAt: new Date().toISOString(),
			})
			.where(eq(matchesTable.id, matchId))
			.returning()
		return match
	}

	async findGroupParticipantsForDraw(groupId: string) {
		return db
			.select({
				matchId: matchesTable.id,
				userId: matchesTable.userId,
			})
			.from(matchesTable)
			.where(
				and(eq(matchesTable.groupId, groupId), isNull(matchesTable.friendId)),
			)
	}
}
