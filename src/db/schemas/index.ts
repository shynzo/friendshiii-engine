import { groupsTable } from "./group"
import { usersTable } from "./user"
import { matchesTable } from "./matches"

export const tables = {
	usersTable,
	groupsTable,
	matchesTable,
} as const

export type Tables = typeof tables
