import { ErrorResponseSchema } from "@/lib/errors"
import { handleError } from "@/lib/handlers"
import type { UserService } from "@/services/user.service"
import type Elysia from "elysia"
import { t } from "elysia"

export const deleteUser = (app: Elysia, userService: UserService) => {
	app.delete(
		"/users/:id",
		async ({ params, set }) => {
			try {
				await userService.deleteUser(params.id)
				set.status = 204
				return null
			} catch (error) {
				return handleError(error, set)
			}
		},
		{
			tags: ["Users"],
			detail: {
				summary: "Deletar usuário",
				description: "Realiza o 'soft-delete' do usuário.",
			},
			response: {
				204: t.Null(),
				400: ErrorResponseSchema,
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
	)

	return app
}
