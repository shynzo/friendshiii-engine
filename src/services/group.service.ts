import type { GroupRepository } from "@/data/repositories/group.repository"
import type { MatchRepository } from "@/data/repositories/match.repository"
import type { UserRepository } from "@/data/repositories/user.repository"
import { GroupStatus } from "@/data/schemas/group"
import type { TCreateGroupDTO, TUpdateGroupDTO } from "@/dtos/group.dto"
import { Errors } from "@/lib/errors"

export class GroupService {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly userRepository: UserRepository,
		private readonly matchRepository: MatchRepository,
	) {}

	private async groupExists(id: string) {
		const group = await this.groupRepository.findById(id)

		if (!group) {
			throw Errors.groupNotFound(id)
		}

		return group
	}

	async createGroup(data: TCreateGroupDTO) {
		const owner = await this.userRepository.findById(data.ownerId)

		if (!owner) {
			throw Errors.userNotFound(data.ownerId)
		}

		if (new Date(data.eventDate) < new Date()) {
			throw Errors.groupInvalidDate(data.eventDate)
		}

		if (data.budget && data.budget < 0) {
			throw Errors.groupInvalidBudget(data.budget)
		}

		const group = await this.groupRepository.create({
			...data,
			status: GroupStatus.WAITING,
		})

		await this.matchRepository.joinGroup(group.id, owner.id)

		return group
	}

	async getGroup(id: string) {
		const group = await this.groupRepository.findById(id)

		if (!group) {
			throw Errors.groupNotFound(id)
		}

		return group
	}

	async getGroupsByOwner(ownerId: string) {
		const owner = await this.userRepository.findById(ownerId)

		if (!owner) {
			throw Errors.userNotFound(ownerId)
		}

		return await this.groupRepository.findByOwnerId(ownerId)
	}

	async getUserGroups(userId: string) {
		const user = await this.userRepository.findById(userId)

		if (!user) {
			throw Errors.userNotFound(userId)
		}

		return await this.groupRepository.findUserGroups(userId)
	}

	async updateGroup(id: string, data: TUpdateGroupDTO) {
		const group = await this.groupExists(id)

		let needsReset = false
		if (group.status === GroupStatus.DRAWN) {
			needsReset = true
		}

		if (data.eventDate && new Date(data.eventDate) < new Date()) {
			throw Errors.groupInvalidDate(data.eventDate)
		}

		if (data.budget && data.budget < 0) {
			throw Errors.groupInvalidBudget(data.budget)
		}

		if (needsReset) {
			const updatedGroup = await this.groupRepository.update(id, data)
			await this.groupRepository.updateStatus(id, GroupStatus.WAITING)
			await Promise.all(
				updatedGroup.participants.map(async (participant) => {
					await this.matchRepository.updateFriend(participant.id, null)
				}),
			)
			return this.groupRepository.findById(id)
		}

		return this.groupRepository.update(id, data)
	}

	async deleteGroup(id: string) {
		const group = await this.groupExists(id)

		if (group.status === GroupStatus.DELETED) {
			throw Errors.groupAlreadyDeleted(id)
		}

		return this.groupRepository.softDelete(id)
	}

	async updateGroupStatus(id: string, status: GroupStatus) {
		const group = await this.groupExists(id)

		return this.groupRepository.updateStatus(id, status)
	}

	async getGroupByStatus(status: GroupStatus) {
		return this.groupRepository.findGroupsByStatus(status)
	}
}
