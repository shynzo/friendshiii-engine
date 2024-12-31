import { Elysia, NotFoundError, t } from "elysia"
import { createUser, getUser, getUserGroups, updateUser } from "../db/queries"

export const users = new Elysia({
	tags: ["Usuários"],
})
	.get(
		"/users/:id",
		async ({ params }) => {
			const user = await getUser({ id: params.id })
			if (!user) {
				throw new NotFoundError("Usuário não encontrado")
			}
			return user
		},
		{
			detail: {
				description: "Retorna um usuário",
				responses: {
					200: {
						description: "Usuário encontrado",
						content: {
							"application/json": {
								schema: {
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
										},
										phone: {
											type: "string",
											description: "Telefone do usuário",
											example: "11999999999",
										},
									},
								},
							},
						},
					},
					404: {
						description: "Usuário não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Usuário não encontrado",
								},
							},
						},
					},
				},
			},
		},
	)
	.post(
		"/users",
		async ({ set, body, error }) => {
			const checkUserExists = await getUser({
				email: body.email,
				phone: body.phone,
			})
			if (checkUserExists) {
				return error(400, "Usuário já existe")
			}

			const user = await createUser(body)

			if (!user) {
				return error(500, "Erro ao criar usuário")
			}

			set.status = 201
			set.headers.location = `/users/${user.id}`
			return user
		},
		{
			body: t.Object({
				name: t.String({
					required: true,
					description: "Nome do usuário",
					example: "João da Silva",
					minLength: 3,
					title: "Nome",
				}),
				email: t.String({
					required: true,
					description: "Email do usuário",
					example: "joao@da.silva.com",
					title: "Email",
					format: "email",
				}),
				phone: t.String({
					title: "Telefone",
					description: "Telefone do usuário",
					example: "11999999999",
					minLength: 11,
					maxLength: 11,
					pattern: "^\\d{11}$",
				}),
			}),
			detail: {
				description: "Cria um usuário",
				responses: {
					201: {
						description: "Usuário criado",
						content: {
							"application/json": {
								schema: {
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
									},
								},
							},
						},
					},
					400: {
						description: "Usuário já existe",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Usuário já existe",
								},
							},
						},
					},
					500: {
						description: "Erro ao criar usuário",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao criar usuário",
								},
							},
						},
					},
				},
			},
		},
	)
	.get(
		"/users/:id/groups",
		async ({ params, error }) => {
			const user = await getUser({ id: params.id })
			if (!user) {
				return error(404, "Usuário não encontrado")
			}
			const groups = await getUserGroups(params.id)
			if (!groups) {
				return error(500, "Erro ao buscar grupos")
			}
			return groups
		},
		{
			params: t.Object({
				id: t.String({
					required: true,
					description: "ID do usuário",
					example: "1234ABCD9",
				}),
			}),
			detail: {
				description:
					"Retorna os grupos do usuário com as informações dos participantes e os matchs caso existam",
				responses: {
					200: {
						description: "Grupos do usuário",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
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
											role: {
												type: "string",
												description: "Função do usuário no grupo",
												example: "owner",
												enum: ["owner", "participant"],
											},
											joinedAt: {
												type: "string",
												description: "Data de entrada no grupo",
												example: "2023-01-01T00:00:00",
												format: "date-time",
											},
											match: {
												type: "object",
												properties: {
													friendName: {
														type: "string",
														description: "Nome do amigo",
														example: "João da Silva",
													},
													matchedAt: {
														type: "string",
														description: "Data de match",
														example: "2023-01-01T00:00:00",
														format: "date-time",
													},
												},
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
									},
								},
							},
						},
					},
					404: {
						description: "Usuário não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Usuário não encontrado",
								},
							},
						},
					},
					500: {
						description: "Erro ao buscar grupos",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao buscar grupos",
								},
							},
						},
					},
				},
			},
		},
	)
	.patch(
		"/users/:id",
		async ({ params, body, error, headers }) => {
			const user = await getUser({ id: params.id })

			if (!user) {
				return error(404, "Usuário não encontrado")
			}

			if (headers["x-user-id"] !== user.id) {
				return error(403, "Você não tem permissão para atualizar este usuário")
			}

			const updatedUser = await updateUser({
				id: params.id,
				name: body.name,
				email: body.email,
				phone: body.phone,
			})

			if (!updatedUser) {
				return error(500, "Erro ao atualizar usuário")
			}

			return updatedUser
		},
		{
			params: t.Object({
				id: t.String({
					required: true,
					description: "ID do usuário",
					example: "1234ABCD9",
				}),
			}),
			body: t.Object({
				name: t.String({
					description: "Nome do usuário",
					example: "João da Silva",
					minLength: 3,
					title: "Nome",
				}),
				email: t.String({
					description: "Email do usuário",
					example: "joao@da.silva.com",
					title: "Email",
					format: "email",
				}),
				phone: t.String({
					title: "Telefone",
					description: "Telefone do usuário",
					example: "11999999999",
					minLength: 11,
					maxLength: 11,
					pattern: "^\\d{11}$",
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
				description: "Atualiza um usuário",
				responses: {
					200: {
						description: "Usuário atualizado",
						content: {
							"application/json": {
								schema: {
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
									},
								},
							},
						},
					},
					403: {
						description: "Você não tem permissão para atualizar este usuário",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Você não tem permissão para atualizar este usuário",
								},
							},
						},
					},
					404: {
						description: "Usuário não encontrado",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Usuário não encontrado",
								},
							},
						},
					},
					500: {
						description: "Erro ao atualizar usuário",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Erro ao atualizar usuário",
								},
							},
						},
					},
				},
			},
		},
	)
