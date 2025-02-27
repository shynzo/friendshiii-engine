// src/services/match.service.ts

import type { MatchRepository } from "@data/repositories/match.repository"
import type { GroupRepository } from "@data/repositories/group.repository"
import type { UserRepository } from "@data/repositories/user.repository"
import type { TCreateMatchesDTO } from "@/dtos/matches.dto"
import { Errors } from "@/lib/errors"
import { GroupStatus } from "@/data/schemas/group"
import createRandomMatches from "@/lib/sorter"

export class MatchService {
	constructor(
		private readonly matchRepository: MatchRepository,
		private readonly groupRepository: GroupRepository,
		private readonly userRepository: UserRepository,
	) {}

	private async validateForDraw(groupId: string) {
		const group = await this.groupRepository.findById(groupId)
		if (!group) {
			throw Errors.groupNotFound(groupId)
		}

		// Verifica se tem participantes suficientes
		if (group.participants.length < 3) {
			throw Errors.insufficientParticipants(
				groupId,
				group.participants.length,
				3,
			)
		}

		// Verifica se a data do evento já passou
		if (new Date(group.eventDate) < new Date()) {
			throw Errors.groupInvalidDate(group.eventDate)
		}

		return group
	}

	async joinGroup(data: TCreateMatchesDTO) {
		const { groupId, userId } = data

		// Valida se o usuário existe
		const user = await this.userRepository.findById(userId)
		if (!user) {
			throw Errors.userNotFound(userId)
		}

		// Valida se o grupo existe
		const group = await this.groupRepository.findById(groupId)
		if (!group) {
			throw Errors.groupNotFound(groupId)
		}

		// Verifica se o usuário já está no grupo
		const isUserInGroup = await this.matchRepository.isUserInGroup(
			groupId,
			userId,
		)
		if (isUserInGroup) {
			throw Errors.userAlreadyInGroup(userId, groupId)
		}

		// Verifica se o grupo já atingiu o limite de participantes
		if (
			group.maximumParticipants &&
			group.participants.length >= group.maximumParticipants
		) {
			throw Errors.groupFull(groupId, group.maximumParticipants)
		}

		// Se o grupo estava sorteado, precisa resetar
		if (group.status === GroupStatus.DRAWN) {
			await this.groupRepository.updateStatus(groupId, GroupStatus.WAITING)
			// Limpa os amigos secretos
			await Promise.all(
				group.participants.map(async (participant) => {
					const match = await this.matchRepository.findGroupMatches(groupId)
					if (match) {
						await this.matchRepository.updateFriend(match[0].id, null)
					}
				}),
			)
		}

		// Adiciona o usuário ao grupo
		return this.matchRepository.joinGroup(groupId, userId)
	}

	async leaveGroup(groupId: string, userId: string) {
		// Valida se o usuário está no grupo
		const isUserInGroup = await this.matchRepository.isUserInGroup(
			groupId,
			userId,
		)
		if (!isUserInGroup) {
			throw Errors.userNotInGroup(userId, groupId)
		}

		// Verifica se é o dono do grupo
		const group = await this.groupRepository.findById(groupId)
		if (!group) {
			throw Errors.groupNotFound(groupId)
		}

		if (group.ownerId === userId) {
			throw new Error("O dono do grupo não pode sair")
		}

		// Se o grupo estava sorteado, precisa resetar
		if (group.status === GroupStatus.DRAWN) {
			await this.groupRepository.updateStatus(groupId, GroupStatus.WAITING)
			// Limpa os amigos secretos
			await Promise.all(
				group.participants.map(async (participant) => {
					const match = await this.matchRepository.findGroupMatches(groupId)
					if (match) {
						await this.matchRepository.updateFriend(match[0].id, null)
					}
				}),
			)
		}

		return this.matchRepository.removeFromGroup(groupId, userId)
	}

	async drawGroup(groupId: string) {
		// Valida o grupo para sorteio
		const group = await this.validateForDraw(groupId)

		// Pega todos os participantes disponíveis para sorteio
		const participants =
			await this.matchRepository.findGroupParticipantsForDraw(groupId)

		// Extrai apenas os IDs dos participantes
		const userIds = participants.map((p) => p.userId)

		// Usa a função de sorteio existente
		const matches = createRandomMatches(userIds)

		// Atualiza os matches no banco
		await Promise.all(
			participants.map(async (participant) => {
				const friendId = matches.get(participant.userId)
				if (friendId) {
					await this.matchRepository.updateFriend(participant.matchId, friendId)
				}
			}),
		)

		// Atualiza o status do grupo
		await this.groupRepository.updateStatus(groupId, GroupStatus.DRAWN)

		return this.groupRepository.findById(groupId)
	}

	async getUserFriend(groupId: string, userId: string) {
		// Valida se o usuário está no grupo
		const isUserInGroup = await this.matchRepository.isUserInGroup(
			groupId,
			userId,
		)
		if (!isUserInGroup) {
			throw Errors.userNotInGroup(userId, groupId)
		}

		const matches = await this.matchRepository.findGroupMatches(groupId)
		const userMatch = matches.find((match) => match.userId === userId)

		if (!userMatch || !userMatch.friendId) {
			return null
		}

		return this.userRepository.findById(userMatch.friendId)
	}
}
