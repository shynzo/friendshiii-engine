import { UpdateUserDTO, UserDTO } from "@/dtos/user.dto"
import { ErrorResponseSchema } from "@/lib/errors"
import { handleError } from "@/lib/handlers"
import { withFullName } from "@/lib/helpers"
import type { UserService } from "@/services/user.service"
import type { Elysia } from "elysia"

export const updateUser = (app: Elysia, userService: UserService) => {
	app.patch(
		"/users/:id",
		async ({ params, body, set }) => {
			try {
				const user = await userService.updateUser(params.id, body)
				set.status = 200
				return withFullName(user)
			} catch (error) {
				return handleError(error, set)
			}
		},
		{
			tags: ["Users"],
			detail: {
				summary: "Atualiza um usuário",
				description:
					"Atualiza o usuário indicado na URL de requisição pelos dados apresentados no corpo da mesma.",
			},
			body: UpdateUserDTO,
			response: {
				200: UserDTO,
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
	)

	return app
}
