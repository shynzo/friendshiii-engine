/*
  1 - Se eu remover o usuário e o grupo está sorteado, eu preciso sortear novamente
  2 - Se eu remover o usuário e o grupo e ele não está sorteado, eu preciso apenas remover ele do grupo
  3 - Se eu remover o usuário e ele é o único usuário do grupo, eu preciso remover o grupo
  4 - Se eu remover o usuário mas o grupo já está finalizado, eu não preciso fazer nada
*/

import { eq } from "drizzle-orm"
import { usersTable } from "../../../data/schemas/user"
import { deleteGroup } from "../groups/deleteGroup"
import { removeUserGroup } from "../groups/removeUserGroup"
import { getUserGroups } from "./getUserGroups"
import db from "../../../data/db"

export const deleteUser = async (userId: string) => {
	const userGroups = await getUserGroups(userId)

	const deleteGroupPromises = userGroups.map(async (group) => {
		if (group.status === "drawn" || group.status === "waiting") {
			if (group.participants.length === 1) {
				return deleteGroup(group.id)
			}
			return removeUserGroup(userId, group.id)
		}
	})

	await Promise.all(deleteGroupPromises)

	const user = await db
		.update(usersTable)
		.set({
			deletedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})
		.where(eq(usersTable.id, userId))
		.returning()

	return user
}
