import { AppError, ErrorCodes } from "./errors"
import type { Context } from "elysia"

export const handleError = (error: unknown, set: Context["set"]) => {
	if (error instanceof AppError) {
		set.status = error.httpStatus
		return error.toJSON()
	}

	set.status = 500
	const unknownError = new AppError({
		code: ErrorCodes.UNKNOWN_ERROR,
		httpStatus: 500,
		message: "Erro interno do servidor",
	})
	return unknownError.toJSON()
}
