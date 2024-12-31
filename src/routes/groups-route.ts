import { Elysia, error, t } from "elysia"
import {
	createGroup,
	getGroup,
	insertMatches,
	updateGroup,
	deleteGroup,
	removeUserGroup,
} from "../db/queries"
import createRandomMatches from "../lib/sorter"

export const groups = new Elysia({
	tags: ["Grupos"],
})
	.get(
		"/groups/:id",
		async ({ params }) => {
			const group = await getGroup(params.id)
			if (!group) {
				return error(404, "Grupo não encontrado")
			}
			return group
		},
		{
			params: t.Object({
				id: t.String({
					required: true,
					description: "ID do grupo",
					example: "1234ABCD9",
				}),
			}),
			detail: {
				description: "Retorna um grupo",
				responses: {
					200: {
						description: "Grupo encontrado",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										id: {
											type: "string",
											description: "ID do grupo",
											example: "123456789",
										},
										name: {
											type: "string",
											description: "Nome do grupo",
											example: "Grupo de Jogos",
										},
										status: {
											type: "string",
											description: "Status do grupo",
											example: "waiting",
											enum: ["waiting", "drawn", "finished", "deleted"],
										},
										description: {
											type: "string",
											description: "Descrição do grupo",
											example:
												"Grupo de Jogos de RPG com o tema de batalha galática",
										},
										createdAt: {
											type: "string",
											description: "Data de criação do grupo",
											example: "2023-01-01T00:00:00",
											format: "date-time",
										},
										eventDate: {
											type: "string",
											description: "Data do evento",
											example: "2023-01-01T00:00:00",
											format: "date-time",
										},
										budget: {
											type: "number",
											description: "Orçamento do grupo",
											example: "1000",
										},
										participants: {
											type: "array",
											items: {
												type: "object",
												properties: {
													id: {
														type: "string",
														description: "ID do usuário",
														example: "123456789",
													},
													name: {
														type: "string",
														description: "Nome do usuário",
														example: "João da Silva",
													},
													email: {
														type: "string",
														description: "Email do usuário",
														example: "joao@da.silva.com",
														format: "email",
													},
													phone: {
														type: "string",
														description: "Telefone do usuário",
														example: "11999999999",
													},
													role: {
														type: "string",
														description: "Função do usuário no grupo",
														example: "owner",
														enum: ["owner", "participant"],
													},
												},
											},
										},
									},
									required: [
										"id",
										"name",
										"status",
										"createdAt",
										"eventDate",
										"participants",
									],
								},
							},
						},
					},
					404: {
						description: "Grupo não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Grupo não encontrado",
								},
							},
						},
					},
				},
			},
		},
	)
	.post(
		"/groups",
		async ({ set, body, error }) => {
			const group = await createGroup(body)

			if (!group) {
				return error(500, "Erro ao criar grupo")
			}

			set.status = 201
			set.headers.location = `/groups/${group.id}`

			return group
		},
		{
			body: t.Object({
				name: t.String({
					required: true,
					description: "Nome do grupo",
					example: "Grupo de Jogos",
					minLength: 3,
					title: "Nome",
				}),
				description: t.String({
					description: "Descrição do grupo",
					example: "Grupo de Jogos de RPG com o tema de batalha galática",
					minLength: 3,
					title: "Descrição",
				}),
				eventDate: t.String({
					required: true,
					title: "Data do evento",
					description: "Data do evento (formato ISO 8601)",
					example: "2023-01-01T00:00:00",
					format: "date-time",
				}),
				budget: t.Number({
					title: "Orçamento",
					description: "Orçamento do grupo",
					example: 1000,
				}),
				maximumParticipants: t.Number({
					title: "Máximo de participantes",
					description: "Máximo de participantes no grupo",
					example: 10,
				}),
				ownerId: t.String({
					required: true,
					title: "ID do dono",
					description: "ID do dono do grupo",
					example: "123456789",
				}),
			}),
			detail: {
				description: "Cria um grupo",
				responses: {
					201: {
						description: "Grupo criado",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										id: {
											type: "string",
											description: "ID do grupo",
											example: "123456789",
										},
										name: {
											type: "string",
											description: "Nome do grupo",
											example: "Grupo de Jogos",
										},
										status: {
											type: "string",
											description: "Status do grupo",
											example: "waiting",
										},
										description: {
											type: "string",
											description: "Descrição do grupo",
											example:
												"Grupo de Jogos de RPG com o tema de batalha galática",
										},
										createdAt: {
											type: "string",
											description: "Data de criação do grupo",
											example: "2023-01-01T00:00:00",
											format: "date-time",
										},
										eventDate: {
											type: "string",
											description: "Data do evento",
											example: "2023-01-01T00:00:00",
											format: "date-time",
										},
										budget: {
											type: "number",
											description: "Orçamento do grupo",
											example: 1000,
										},
										ownerId: {
											type: "string",
											description: "ID do dono do grupo",
											example: "123456789",
										},
										maximumParticipants: {
											type: "number",
											description: "Máximo de participantes no grupo",
											example: 10,
										},
									},
									required: [
										"id",
										"name",
										"status",
										"createdAt",
										"eventDate",
										"ownerId",
									],
								},
							},
						},
					},
					500: {
						description: "Erro ao criar grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao criar grupo",
								},
							},
						},
					},
				},
			},
		},
	)
	.patch(
		"/groups/:id",
		async ({ params, body, error, headers }) => {
			const group = await getGroup(params.id)

			if (!group) {
				return error(404, "Grupo não encontrado")
			}

			if (headers["x-user-id"] !== group.ownerId) {
				return error(403, "Você não tem permissão para atualizar este grupo")
			}

			const updatedGroup = await updateGroup({
				id: params.id,
				name: body.name,
				description: body.description,
				eventDate: body.eventDate,
				budget: body.budget,
				maximumParticipants: body.maximumParticipants,
			})

			if (!updatedGroup) {
				return error(500, "Erro ao atualizar grupo")
			}

			return updatedGroup
		},
		{
			params: t.Object({
				id: t.String({
					required: true,
					description: "ID do grupo",
					example: "1234ABCD9",
				}),
			}),
			body: t.Object({
				name: t.String({
					description: "Nome do grupo",
					example: "Grupo de Jogos",
					minLength: 3,
					title: "Nome",
				}),
				description: t.String({
					description: "Descrição do grupo",
					example: "Grupo de Jogos de RPG com o tema de batalha galática",
					minLength: 3,
					title: "Descrição",
				}),
				eventDate: t.String({
					title: "Data do evento",
					description: "Data do evento (formato ISO 8601)",
					example: "2023-01-01T00:00:00",
					format: "date-time",
				}),
				budget: t.Number({
					title: "Orçamento",
					description: "Orçamento do grupo",
					example: 1000,
				}),
				maximumParticipants: t.Number({
					title: "Máximo de participantes",
					description: "Máximo de participantes no grupo",
					example: 10,
				}),
			}),
			headers: t.Object({
				"x-user-id": t.String({
					required: true,
					description: "ID do usuário logado",
					example: "123456789",
				}),
			}),
			detail: {
				description: "Atualiza um grupo",
				responses: {
					200: {
						description: "Grupo atualizado",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										id: {
											type: "string",
											description: "ID do grupo",
											example: "123456789",
										},
										name: {
											type: "string",
											description: "Nome do grupo",
											example: "Grupo de Jogos",
										},
										status: {
											type: "string",
											description: "Status do grupo",
											example: "waiting",
										},
										description: {
											type: "string",
											description: "Descrição do grupo",
											example:
												"Grupo de Jogos de RPG com o tema de batalha galática",
										},
										createdAt: {
											type: "string",
											description: "Data de criação do grupo",
											example: "2023-01-01T00:00:00",
											format: "date-time",
										},
										eventDate: {
											type: "string",
											description: "Data do evento",
											example: "2023-01-01T00:00:00",
											format: "date-time",
										},
										budget: {
											type: "number",
											description: "Orçamento do grupo",
											example: 1000,
										},
										ownerId: {
											type: "string",
											description: "ID do dono do grupo",
											example: "123456789",
										},
										maximumParticipants: {
											type: "number",
											description: "Máximo de participantes no grupo",
											example: 10,
										},
									},
									required: [
										"id",
										"name",
										"status",
										"createdAt",
										"eventDate",
										"ownerId",
									],
								},
							},
						},
					},
					403: {
						description: "Você não tem permissão para atualizar este grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Você não tem permissão para atualizar este grupo",
								},
							},
						},
					},
					404: {
						description: "Grupo não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Grupo não encontrado",
								},
							},
						},
					},
					500: {
						description: "Erro ao atualizar grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao atualizar grupo",
								},
							},
						},
					},
				},
			},
		},
	)
	.delete(
		"/groups/:id",
		async ({ set, params, error, headers }) => {
			const group = await getGroup(params.id)

			if (!group) {
				return error(404, "Grupo não encontrado")
			}

			if (headers["x-user-id"] !== group.ownerId) {
				return error(403, "Você não tem permissão para deletar este grupo")
			}

			const deletedGroup = await deleteGroup(params.id)

			if (!deletedGroup) {
				return error(500, "Erro ao deletar grupo")
			}

			set.status = 204

			return
		},
		{
			params: t.Object({
				id: t.String({
					required: true,
					description: "ID do grupo",
					example: "1234ABCD9",
				}),
			}),
			headers: t.Object({
				"x-user-id": t.String({
					required: true,
					description: "ID do usuário logado",
					example: "123456789",
				}),
			}),
			detail: {
				description: "Deleta um grupo",
				responses: {
					204: {
						description: "Grupo deletado",
					},
					403: {
						description: "Você não tem permissão para deletar este grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Você não tem permissão para deletar este grupo",
								},
							},
						},
					},
					404: {
						description: "Grupo não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Grupo não encontrado",
								},
							},
						},
					},
					500: {
						description: "Erro ao deletar grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao deletar grupo",
								},
							},
						},
					},
				},
			},
		},
	)
	.post(
		"/groups/:id/draw",
		async ({ set, params, error, headers }) => {
			const group = await getGroup(params.id)

			if (!group) {
				return error(404, "Grupo não encontrado")
			}

			if (headers["x-user-id"] !== group.ownerId) {
				return error(403, "Você não tem permissão para sortear este grupo")
			}

			if (group.status !== "waiting") {
				return error(400, "Grupo não está disponível para sorteio.")
			}

			if (group.participants.length <= 2) {
				return error(400, "Não há participantes suficientes para sortear.")
			}

			const matches = createRandomMatches(group.participants.map((p) => p.id))

			await insertMatches(matches, params.id)

			set.status = 204

			return
		},
		{
			params: t.Object({
				id: t.String({
					required: true,
					description: "ID do grupo",
					example: "1234ABCD9",
				}),
			}),
			headers: t.Object({
				"x-user-id": t.String({
					required: true,
					description: "ID do usuário logado",
					example: "123456789",
				}),
			}),
			detail: {
				description: "Sorteia um grupo",
				responses: {
					204: {
						description: "Grupo sorteado",
					},
					403: {
						description: "Você não tem permissão para sortear este grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Você não tem permissão para sortear este grupo",
								},
							},
						},
					},
					404: {
						description: "Grupo não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Grupo não encontrado",
								},
							},
						},
					},
					400: {
						description: "Grupo não está disponível para sorteio.",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Grupo não está disponível para sorteio.",
								},
							},
						},
					},
					500: {
						description: "Erro ao sortear grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao sortear grupo",
								},
							},
						},
					},
				},
			},
		},
	)
	.patch(
		"/groups/:id",
		async ({ set, params, body, error, headers }) => {
			const group = await getGroup(params.id)
			if (!group) {
				return error(404, "Grupo não encontrado")
			}

			if (headers["x-user-id"] !== group.ownerId) {
				return error(403, "Você não tem permissão para atualizar este grupo")
			}

			await removeUserGroup(params.id, body.userId)

			set.status = 204
			return
		},
		{
			params: t.Object({
				id: t.String({
					required: true,
					description: "ID do grupo",
					example: "1234ABCD9",
				}),
			}),
			body: t.Object({
				userId: t.String({
					required: true,
					description: "ID do usuário",
					example: "123456789",
				}),
			}),
			headers: t.Object({
				"x-user-id": t.String({
					required: true,
					description: "ID do usuário logado",
					example: "123456789",
				}),
			}),
			detail: {
				description: "Remove um usuário de um grupo",
				responses: {
					204: {
						description: "Usuário removido do grupo",
					},
					403: {
						description:
							"Você não tem permissão para remover este usuário do grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example:
										"Você não tem permissão para remover este usuário do grupo",
								},
							},
						},
					},
					404: {
						description: "Grupo não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Grupo não encontrado",
								},
							},
						},
					},
					500: {
						description: "Erro ao remover usuário do grupo",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao remover usuário do grupo",
								},
							},
						},
					},
				},
			},
		},
	)
