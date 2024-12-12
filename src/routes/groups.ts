import { Hono } from "hono"
import createRandomMatches from "../lib/sorter"
import { HTTPException } from "hono/http-exception"
import { validator } from "hono/validator"
import {
	createGroup,
	existsInGroup,
	getGroup,
	getGroupMatches,
	getGroupUsers,
	insertMatches,
	getUser,
} from "../db/queries"
import {
	validateGroup,
	validateGroupBody,
	validateGroupDrawed,
	validateId,
	validateOwner,
} from "../middleware/validator"
import { addUserGroup } from "../db/queries/groups/addUserGroup"

const groups = new Hono()

groups.get("/:groupId", validateId("groupId"), validateGroup, async (c) => {
	const group = c.get("group")
	const users = await getGroupUsers(group.id)
	return c.json({ group, users }, 200)
})

groups.post("/", validateGroupBody, validateOwner, async (c) => {
	const data = c.get("groupBody")

	const group = await createGroup(data.name, data.ownerId, data.eventDate)

	return c.json({ group }, 201)
})

groups.post(
	"/:groupId/add",
	validator("param", (param, c) => {
		const id = Number(param.groupId)
		if (Number.isNaN(id)) {
			throw new HTTPException(400, {
				message: "ID do grupo inválido",
			})
		}
		return { id }
	}),
	validator("json", (value, c) => {
		const userId = Number(value.userId)
		if (!userId || Number.isNaN(userId)) {
			throw new HTTPException(400, {
				message: "ID do usuário inválido",
			})
		}
		return { userId }
	}),
	async (c) => {
		const { id } = c.req.valid("param")
		const { userId } = c.req.valid("json")

		try {
			// Verifica se o usuário existe
			const [user] = await getUser({ id: userId })
			if (!user) {
				throw new HTTPException(404, {
					message: "Usuário não encontrado",
				})
			}

			const [group] = await getGroup(id)

			if (!group) {
				throw new HTTPException(404, {
					message: "Grupo não encontrado",
				})
			}

			if (group.status !== "waiting") {
				throw new HTTPException(400, {
					message:
						"Não é possível adicionar usuário a grupo que não está esperando",
				})
			}

			const userExists = await existsInGroup(userId, id)

			if (userExists) {
				throw new HTTPException(400, {
					message: "Usuário já está no grupo",
				})
			}

			const users = await addUserGroup(userId, id)

			return c.json({ message: "Usuário adicionado com sucesso", users }, 201)
		} catch (error) {
			console.error(error)
			if (error instanceof HTTPException) {
				return c.json({ error: error.message }, error.status)
			}
			return c.json({ error: "Ocorreu um erro inesperado" }, 500)
		}
	},
)

groups.post(
	"/:groupId/draw",
	validateId("groupId"),
	validateGroup,
	validateGroupDrawed,
	async (c) => {
		const id = c.get("groupId")

		const currentUsers = await getGroupUsers(id)

		if (currentUsers.length < 2) {
			throw new HTTPException(400, {
				message: "Não é possível sortear grupo com menos de 2 usuários",
			})
		}

		const usersIds = currentUsers.map((r) => r.id)
		const matches = createRandomMatches(usersIds)

		await insertMatches(new Map(matches), id)

		const users = await getGroupMatches(id)

		return c.json({ users })
	},
)

export default groups
