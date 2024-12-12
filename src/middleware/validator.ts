import type { InferSelectModel } from "drizzle-orm"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import type { Next } from "hono/types"
import { insertUserSchema, type usersTable } from "../db/schemas/user"
import { getGroup, getUser } from "../db/queries"
import { insertGroupSchema, type groupsTable } from "../db/schemas/group"
import type { z } from "zod"

interface Variables {
	id: number
	user: InferSelectModel<typeof usersTable>
	userBody: z.infer<typeof insertUserSchema>
	groupId: number
	group: InferSelectModel<typeof groupsTable>
	groupBody: z.infer<typeof insertGroupSchema>
	owner: InferSelectModel<typeof usersTable>
}

export const validateId = (paramName: string) => {
	return async (c: Context, next: Next) => {
		const id = Number(c.req.param(paramName))

		if (Number.isNaN(id)) {
			throw new HTTPException(400, {
				message: `${paramName} inválido`,
			})
		}

		c.set(paramName, id)
		await next()
	}
}

export const validateUser = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const id = c.get("id")
	const [user] = await getUser({ id })

	if (!user) {
		throw new HTTPException(404, {
			message: "Usuário não encontrado",
		})
	}

	c.set("user", user)
	await next()
}

export const validateUserBody = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const body = await c.req.json()
	const parse = insertUserSchema.safeParse(body)
	console.log(parse)
	if (!parse.success) {
		throw new HTTPException(400, {
			message: "Dados inválidos",
			cause: parse.error.issues,
		})
	}

	c.set("userBody", parse.data)
	await next()
}

export const validateUserExists = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const { email, phone } = c.get("userBody")
	const existingUser = await getUser({ email, phone })

	if (existingUser.length > 0) {
		throw new HTTPException(409, {
			message: "Email ou telefone já cadastrado",
		})
	}

	await next()
}

export const validateGroup = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const groupId = c.get("groupId")
	const [group] = await getGroup(groupId)

	if (!group) {
		throw new HTTPException(404, {
			message: "Grupo não encontrado",
		})
	}

	c.set("group", group)
	await next()
}
export const validateGroupBody = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const body = await c.req.json()
	const parse = insertGroupSchema.safeParse(body)

	if (!parse.success) {
		throw new HTTPException(400, {
			message: "Dados inválidos",
			cause: parse.error.issues,
		})
	}

	c.set("groupBody", parse.data)
	await next()
}

export const validateOwner = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const { ownerId } = c.get("groupBody")
	const [owner] = await getUser({ id: ownerId })

	if (!owner) {
		throw new HTTPException(404, {
			message: "Usuário não encontrado",
		})
	}

	c.set("owner", owner)
	await next()
}

export const validateGroupDrawed = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const group = c.get("group")

	if (group.status === "drawed") {
		throw new HTTPException(400, {
			message: "O grupo já foi sorteado.",
		})
	}

	await next()
}

export const validateGroupWaiting = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const group = c.get("group")

	if (group.status !== "waiting") {
		throw new HTTPException(400, {
			message:
				"Não é possível adicionar usuário a grupo que não está esperando",
		})
	}

	await next()
}
