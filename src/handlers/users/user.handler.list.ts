import { UserDTO } from "@/dtos/user.dto"
import { ErrorResponseSchema } from "@/lib/errors"
import { handleError } from "@/lib/handlers"
import { withFullName } from "@/lib/helpers"
import type { UserService } from "@/services/user.service"
import { t, type Elysia } from "elysia"

export const listUsers = (app: Elysia, userService: UserService) => {
	app.get(
		"/users",
		async ({ query, set }) => {
			try {
				const users = (
					await userService.getActiveUsers({
						limit: query.limit,
						offset: query.offset,
					})
				).map((user) => withFullName(user))

				set.status = 200

				return users
			} catch (error) {
				return handleError(error, set)
			}
		},
		{
			tags: ["Users"],
			detail: {
				summary: "Listagem de usuários",
				description:
					"Apresenta uma lista dos usuários de acordo com a quantidade especificada.",
			},
			query: t.Object({
				limit: t.Number({
					title: "Limite de usuários",
					description:
						"Quantidade máxima de usuários a serem retornados por página",
					minimum: 1,
					maximum: 100,
					default: 10,
				}),
				offset: t.Number({
					title: "Deslocamento",
					description:
						"Número de registros a serem pulados antes de começar a retornar",
					minimum: 0,
					default: 0,
				}),
			}),
			response: {
				200: t.Array(UserDTO),
				500: ErrorResponseSchema,
			},
		},
	)

	return app
}
