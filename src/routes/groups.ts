import { Hono } from "hono"
import db from "../db"
import { groupsTable } from "../db/schemas/group"
import { matchesTable } from "../db/schemas/matches"
import { and, eq } from "drizzle-orm"
import createRandomMatches from "../lib/sorter"
import { usersMatches } from "../db/queries/usersMatches"
import { HTTPException } from "hono/http-exception"
import { validator } from "hono/validator"

const groups = new Hono()

groups.get("/:id", async (c) => {
	const id = Number(c.req.param("id"))
	try {
		const group = await db
			.select()
			.from(groupsTable)
			.where(eq(groupsTable.id, id))
			.limit(1)

		if (!group.length) {
			throw new HTTPException(404, {
				message: "Grupo não encontrado",
			})
		}

		return c.json({ group }, 200)
	} catch (error) {
		console.error(error)
		if (error instanceof HTTPException) {
			return c.json({ error: error.message }, error.status)
		}
		return c.json({ error: "Ocorreu um erro inesperado" }, 500)
	}
})

groups.post("/", async (c) => {
	try {
		const { name, ownerId, eventDate } =
			await c.req.json<typeof groupsTable.$inferInsert>()
		if (!name || !ownerId) {
			throw new HTTPException(400, {
				message: "Os campos name e ownerId são obrigatórios",
			})
		}
		const group = await db
			.insert(groupsTable)
			.values({
				name,
				ownerId,
				status: "waiting",
				eventDate: eventDate ?? undefined,
			})
			.returning({
				id: groupsTable.id,
				name: groupsTable.name,
				ownerId: groupsTable.ownerId,
				status: groupsTable.status,
				eventDate: groupsTable.eventDate,
			})
		await db
			.insert(matchesTable)
			.values([{ groupId: group[0].id, userId: ownerId }])
		return c.json({ group }, 201)
	} catch (error) {
		console.error(error)
		if (error instanceof HTTPException) {
			return c.json({ error: error.message }, error.status)
		}
		return c.json({ error: "Ocorreu um erro inesperado" }, 500)
	}
})

groups.post("/:id/add", async (c) => {
	const id = Number(c.req.param("id"))
	const { userId } = await c.req.json<typeof matchesTable.$inferInsert>()
	try {
		if (!userId) {
			throw new HTTPException(400, {
				message: "O campo userId é obrigatório",
			})
		}
		const group = await db
			.select()
			.from(groupsTable)
			.where(eq(groupsTable.id, id))
			.limit(1)

		if (!group.length) {
			throw new HTTPException(404, {
				message: "Grupo não encontrado",
			})
		}
		if (group[0].status !== "waiting") {
			throw new HTTPException(400, {
				message:
					"Não é possível adicionar usuário a grupo que não está esperando",
			})
		}

		const matches = await db
			.select()
			.from(matchesTable)
			.where(and(eq(matchesTable.groupId, id), eq(matchesTable.userId, userId)))

		if (matches.length) {
			throw new HTTPException(400, {
				message: "Usuário já está no grupo",
			})
		}

		await db.insert(matchesTable).values({
			groupId: id,
			userId,
		})

		return c.json({ message: "Usuário adicionado com sucesso" }, 201)
	} catch (error) {
		console.error(error)
		if (error instanceof HTTPException) {
			return c.json({ error: error.message }, error.status)
		}
		return c.json({ error: "Ocorreu um erro inesperado" }, 500)
	}
})

// groups.post("/:id/remove", async (c) => {
// 	const id = Number(c.req.param("id"))
// 	const { userId } = await c.req.json<typeof matchesTable.$inferInsert>()
// 	const group = await db
// 		.delete(matchesTable)
// 		.where(and(eq(matchesTable.userId, userId), eq(matchesTable.groupId, id)))
// 	return c.json({ group })
// })

groups.post("/:id/draw", async (c) => {
	const id = Number(c.req.param("id"))
	try {
		const currentGroup = await db
			.select()
			.from(groupsTable)
			.where(eq(groupsTable.id, id))
			.limit(1)
		if (!currentGroup.length) {
			throw new HTTPException(404, {
				message: "Grupo não encontrado",
			})
		}
		if (currentGroup[0].status !== "waiting") {
			throw new HTTPException(400, {
				message: "Não é possível fazer draw de grupo que não está esperando",
			})
		}

		const currentUsers = await db
			.select({
				userId: matchesTable.userId,
			})
			.from(matchesTable)
			.where(eq(matchesTable.groupId, id))

		const usersIds = currentUsers.map((r) => r.userId)
		const matches = createRandomMatches(usersIds)

		for (const [userId, friendId] of matches) {
			await db
				.update(matchesTable)
				.set({ friendId })
				.where(
					and(eq(matchesTable.userId, userId), eq(matchesTable.groupId, id)),
				)
		}

		await db
			.update(groupsTable)
			.set({ status: "drawed" })
			.where(eq(groupsTable.id, id))

		const users = await usersMatches(id)

		return c.json({ users })
	} catch (error) {
		console.error(error)
		if (error instanceof HTTPException) {
			return c.json({ error: error.message }, error.status)
		}
		return c.json({ error: "Ocorreu um erro inesperado" }, 500)
	}
})

export default groups
