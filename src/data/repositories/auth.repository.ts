// src/data/repositories/auth.repository.ts
import { generateToken } from "@/lib/helpers"
import db from "../db"
import { authTable } from "../schemas/auth"
import { and, eq, gt, isNull, lt } from "drizzle-orm"

export class AuthRepository {
	async createEmailToken(userId: string) {
		const token = generateToken(32) // Função para gerar token aleatório
		const expiresAt = new Date()
		expiresAt.setHours(expiresAt.getHours() + 1) // Token válido por 1 hora

		const [record] = await db
			.insert(authTable)
			.values({
				userId,
				emailToken: token,
				emailTokenExpiresAt: expiresAt.toISOString(),
			})
			.returning()

		return token
	}

	async verifyEmailToken(userId: string, token: string) {
		const [auth] = await db
			.select()
			.from(authTable)
			.where(
				and(
					eq(authTable.userId, userId),
					eq(authTable.emailToken, token),
					gt(authTable.emailTokenExpiresAt, new Date().toISOString()),
					isNull(authTable.emailTokenUsedAt),
				),
			)
			.limit(1)

		if (!auth) return null

		// Marca token como usado
		await db
			.update(authTable)
			.set({
				emailTokenUsedAt: new Date().toISOString(),
			})
			.where(eq(authTable.id, auth.id))

		return auth
	}

	async createRefreshToken(userId: string) {
		const token = generateToken(64)
		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + 7) // 7 dias de validade

		await db
			.update(authTable)
			.set({
				refreshToken: token,
				refreshTokenExpiresAt: expiresAt.toISOString(),
				lastLoginAt: new Date().toISOString(),
			})
			.where(eq(authTable.userId, userId))

		return {
			token,
			expiresAt: expiresAt.toISOString(),
		}
	}

	async verifyRefreshToken(userId: string, token: string) {
		const [auth] = await db
			.select()
			.from(authTable)
			.where(
				and(
					eq(authTable.userId, userId),
					eq(authTable.refreshToken, token),
					gt(authTable.refreshTokenExpiresAt, new Date().toISOString()),
				),
			)
			.limit(1)

		return auth || null
	}

	async revokeRefreshToken(userId: string) {
		return db
			.update(authTable)
			.set({
				refreshToken: null,
				refreshTokenExpiresAt: null,
			})
			.where(eq(authTable.userId, userId))
	}

	async cleanupExpiredTokens() {
		await db
			.delete(authTable)
			.where(lt(authTable.emailTokenExpiresAt, new Date().toISOString()))
	}
}
