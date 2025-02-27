import { UserDTO } from "@/dtos/user.dto"
import { ErrorResponseSchema } from "@/lib/errors"
import { handleError } from "@/lib/handlers"
import { withFullName } from "@/lib/helpers"
import type { UserService } from "@/services/user.service"
import type { Elysia } from "elysia"

export const getUser = (app: Elysia, userService: UserService) => {
	app.get(
		"/users/:id",
		async ({ params, set }) => {
			try {
				const user = await userService.getUser(params.id)
				set.status = 200
				return withFullName(user)
			} catch (error) {
				return handleError(error, set)
			}
		},
		{
			tags: ["Users"],
			response: {
				200: UserDTO,
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
			detail: {
				summary: "Obter Usuário",
				description:
					"Retorna os dados do usuário com o identificador informado",
			},
		},
	)

	return app
}
