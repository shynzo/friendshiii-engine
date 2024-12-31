import { getUser } from "./getUser"
import { getUserGroups } from "./getUserGroups"

export const getUserData = async (userId: string) => {
	const user = await getUser({ id: userId })
	const groups = await getUserGroups(userId)

	return {
		user,
		groups,
	}
}
