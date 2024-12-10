import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"

export const errorHandler = async (err: Error, c: Context) => {
	console.error(err)

	if (err instanceof HTTPException) {
		return c.json({ error: err.message }, err.status)
	}

	return c.json({ error: "Ocorreu um erro inesperado" }, 500)
}
