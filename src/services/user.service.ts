import type { UserRepository } from "@/data/repositories/user.repository"
import type { TCreateUserDTO, TUpdateUserDTO } from "@/dtos/user.dto"
import { Errors } from "@/lib/errors"

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async createUser(data: TCreateUserDTO) {
		const existingUser = await this.userRepository.findByEmail(data.email)

		if (existingUser) {
			throw Errors.userAlreadyExists(data.email)
		}

		return this.userRepository.create(data)
	}

	async getUser(id: string) {
		const user = await this.userRepository.findById(id)

		if (!user) {
			throw Errors.userNotFound(id)
		}

		return user
	}

	async updateUser(id: string, data: TUpdateUserDTO) {
		const user = await this.userRepository.findById(id)

		if (!user) {
			throw Errors.userNotFound(id)
		}

		return this.userRepository.update(id, data)
	}

	async deleteUser(id: string) {
		const user = await this.userRepository.findById(id)

		if (!user) {
			throw Errors.userNotFound(id)
		}

		if (user.deletedAt) {
			throw Errors.userAlreadyDeleted(id)
		}

		return this.userRepository.softDelete(id)
	}

	async getActiveUsers({
		limit,
		offset,
	}: {
		limit: number
		offset: number
	}) {
		return this.userRepository.findActiveUsers({ limit, offset })
	}
}
