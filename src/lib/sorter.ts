function createRandomMatches(userIds: number[]): Map<number, number> {
	if (userIds.length < 2) {
		throw new Error("Precisa de pelo menos 2 usuários para fazer matches")
	}

	const shuffled = Array.from(userIds)

	for (let i = userIds.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		while (j === i) {
			j = Math.floor(Math.random() * (i + 1))
		}
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}

	const matches = new Map<number, number>()

	for (let i = 0; i < userIds.length; i++) {
		matches.set(userIds[i], shuffled[i])
	}

	return matches
}

export default createRandomMatches
