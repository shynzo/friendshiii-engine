// src/data/schemas/auth.ts
import { generateId } from "@/lib/helpers"
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { usersTable } from "./user"

export const authTable = sqliteTable(
	"auth",
	{
		id: text("id").primaryKey().$defaultFn(generateId),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id),
		emailToken: text("email_token"), // Token de uso único para login
		emailTokenExpiresAt: text("email_token_expires_at"),
		emailTokenUsedAt: text("email_token_used_at"),
		refreshToken: text("refresh_token"), // Para revogação de acesso
		refreshTokenExpiresAt: text("refresh_token_expires_at"),
		lastLoginAt: text("last_login_at"),
		createdAt: text("created_at")
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
	},
	(auth) => ({
		userIdIndex: index("user_id_index").on(auth.userId),
		emailTokenIndex: index("email_token_index").on(auth.emailToken),
		refreshTokenIndex: index("refresh_token_index").on(auth.refreshToken),
	}),
)
