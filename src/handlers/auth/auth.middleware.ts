// src/presentation/auth/auth.middleware.ts
import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { env } from "@/lib/env"

export const authMiddleware = new Elysia()
	.use(
		jwt({
			name: "jwt",
			secret: env.JWT_SECRET || "sua-chave-super-secreta-para-desenvolvimento",
		}),
	)
	.derive({ as: "global" }, ({ headers, jwt, set }) => {
		return {
			async authorize() {
				const authHeader = headers.authorization
				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					set.status = 401
					return null
				}

				const token = authHeader.substring(7)
				const payload = await jwt.verify(token)

				if (!payload || !payload.sub) {
					set.status = 401
					return null
				}

				return payload
			},
		}
	})
