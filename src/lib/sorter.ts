function createRandomMatches(userIds: string[]): Map<string, string> {
	const shuffled = Array.from(userIds)

	for (let i = userIds.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		while (j === i) {
			j = Math.floor(Math.random() * (i + 1))
		}
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}

	const matches = new Map<string, string>()

	for (let i = 0; i < userIds.length; i++) {
		matches.set(userIds[i], shuffled[i])
	}

	return matches
}

export default createRandomMatches
