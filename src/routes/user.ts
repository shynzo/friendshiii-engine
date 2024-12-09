import { Hono } from "hono"
import db from "../db"
import { insertUserSchema, usersTable } from "../db/schemas/user"
import { and, eq, sql } from "drizzle-orm"
import { groupsTable } from "../db/schemas/group"
import { matchesTable } from "../db/schemas/matches"
import { HTTPException } from "hono/http-exception"
import { validator } from "hono/validator"

const users = new Hono()

users.get("/:id", async (c) => {
	const id = Number(c.req.param("id"))
	const user = await db.select().from(usersTable).where(eq(usersTable.id, id))
	return c.json({ user })
})

users.post(
	"/",
	validator("json", (value, c) => {
		const parse = insertUserSchema.safeParse(value)
		if (!parse.success) {
			throw new HTTPException(400, {
				message: parse.error.issues[0].message,
			})
		}
		return parse.data
	}),
	async (c) => {
		try {
			const { name, email, phone } = c.req.valid("json")

			const user = await db
				.insert(usersTable)
				.values({
					name,
					email,
					phone,
				})
				.returning({
					id: usersTable.id,
					name: usersTable.name,
					email: usersTable.email,
					phone: usersTable.phone,
				})

			return c.json({ user }, 201)
		} catch (error) {
			console.error(error)
			if (error instanceof HTTPException) {
				return c.json({ error: error.message }, error.status)
			}
			return c.json({ error: "Ocorreu um erro inesperado" }, 500)
		}
	},
)

users.get("/:id/groups", async (c) => {
	const id = Number(c.req.param("id"))

	const usersSubquery = db.select().from(usersTable).as("owner")

	const groups = await db
		.select({
			id: groupsTable.id,
			name: groupsTable.name,
			eventDate: groupsTable.eventDate,
			status: groupsTable.status,
			ownerName: usersSubquery.name,
		})
		.from(matchesTable)
		.leftJoin(groupsTable, eq(matchesTable.groupId, groupsTable.id))
		.leftJoin(usersSubquery, eq(groupsTable.ownerId, usersSubquery.id))
		.where(eq(matchesTable.userId, id))
		.orderBy(sql`event_date DESC`)

	return c.json({ groups })
})

export default users
