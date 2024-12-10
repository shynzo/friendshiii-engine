import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { createUser, getUserGroups, getUserMatch } from "../db/queries"
import {
	validateGroup,
	validateGroupDrawed,
	validateId,
	validateUser,
	validateUserBody,
	validateUserExists,
} from "../middleware/validator"

const users = new Hono()

users.get("/:id", validateId("id"), validateUser, async (c) => {
	const user = c.get("user")

	return c.json({ user })
})

users.post("/", validateUserBody, validateUserExists, async (c) => {
	const { name, email, phone } = c.get("userBody")

	const user = await createUser(name, email, phone)

	return c.json({ user }, 201)
})

users.get("/:id/groups", validateId("id"), validateUser, async (c) => {
	const id = c.get("id")

	// Busca os grupos
	const groups = await getUserGroups(id)

	return c.json({ groups })
})

users.get(
	"/:id/group/:groupId/match",
	validateId("id"),
	validateUser,
	validateId("groupId"),
	validateGroup,
	validateGroupDrawed,
	async (c) => {
		const id = c.get("id")
		const groupId = c.get("groupId")

		const [match] = await getUserMatch(id, groupId)

		if (!match.friend) {
			throw new HTTPException(404, {
				message: "O grupo ainda não foi sorteado.",
			})
		}

		return c.json({ match })
	},
)

export default users
