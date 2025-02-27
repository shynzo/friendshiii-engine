import { GroupDTO } from "@/dtos/group.dto"
import { ErrorResponseSchema } from "@/lib/errors"
import { handleError } from "@/lib/handlers"
import type { GroupService } from "@/services/group.service"
import type Elysia from "elysia"

export const getGroup = (app: Elysia, groupService: GroupService) => {
	app.get(
		"/groups/:id",
		async ({ params, set }) => {
			try {
				const group = await groupService.getGroup(params.id)
				set.status = 200
				return group
			} catch (error) {
				return handleError(error, set)
			}
		},
		{
			tags: ["Groups"],
			response: {
				200: GroupDTO,
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
			detail: {
				summary: "Obter Grupo",
				description: "Retorna as informações do grupo e seus participantes.",
			},
		},
	)

	return app
}
