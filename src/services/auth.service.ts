// src/services/auth.service.ts
import type { AuthRepository } from "@/data/repositories/auth.repository"
import type { UserRepository } from "@/data/repositories/user.repository"
import { Errors } from "@/lib/errors"

export class AuthService {
	constructor(
		private userRepository: UserRepository,
		private authRepository: AuthRepository,
	) {}

	async requestLoginToken(email: string) {
		const user = await this.userRepository.findByEmail(email)

		if (!user) {
			throw Errors.userNotFound(email)
		}

		const token = await this.authRepository.createEmailToken(user.id)

		// TODO: Enviar email com token
		console.log(`Token gerado para ${email}: ${token}`)

		return true
	}

	async verifyEmailToken(email: string, token: string) {
		const user = await this.userRepository.findByEmail(email)

		if (!user) {
			throw Errors.userNotFound(email)
		}

		const auth = await this.authRepository.verifyEmailToken(user.id, token)

		if (!auth) {
			throw Errors.unauthorized("Token inválido ou expirado")
		}

		return user
	}

	async createRefreshToken(userId: string) {
		return this.authRepository.createRefreshToken(userId)
	}

	async verifyRefreshToken(userId: string, refreshToken: string) {
		const auth = await this.authRepository.verifyRefreshToken(
			userId,
			refreshToken,
		)

		if (!auth) {
			throw Errors.unauthorized("Refresh token inválido ou expirado")
		}

		return true
	}

	async getUserById(userId: string) {
		const user = await this.userRepository.findById(userId)

		if (!user) {
			throw Errors.userNotFound(userId)
		}

		return user
	}

	async revokeRefreshToken(userId: string) {
		return this.authRepository.revokeRefreshToken(userId)
	}

	async cleanupExpiredTokens() {
		await this.authRepository.cleanupExpiredTokens()
	}
}
