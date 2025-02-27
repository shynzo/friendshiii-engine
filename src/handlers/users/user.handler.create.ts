import { CreateUserDTO, UserDTO } from "@/dtos/user.dto"
import { ErrorResponseSchema } from "@/lib/errors"
import { handleError } from "@/lib/handlers"
import { withFullName } from "@/lib/helpers"
import type { UserService } from "@/services/user.service"
import type { Elysia } from "elysia"

export const createUser = (app: Elysia, userService: UserService) => {
	app.post(
		"/users",
		async ({ body, set }) => {
			try {
				const user = await userService.createUser(body)
				set.status = 201
				return withFullName(user)
			} catch (error) {
				return handleError(error, set)
			}
		},
		{
			tags: ["Users"],
			body: CreateUserDTO,
			response: {
				201: UserDTO,
				400: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
			detail: {
				summary: "Criar Usuário",
				description: "Cria um novo usuário no sistema com os dados fornecidos",
			},
		},
	)
	return app
}
