import { t } from "elysia"

export const ErrorCodes = {
	// Erros genéricos (10000-19999)
	UNKNOWN_ERROR: "F10000",
	VALIDATION_ERROR: "F10001",
	NOT_FOUND: "F10002",
	UNAUTHORIZED: "F10003",
	FORBIDDEN: "F10004",
	BAD_REQUEST: "F10005",
	CONFLICT: "F10006",

	// Erros relacionados a usuários (20000-29999)
	USER_ALREADY_EXISTS: "F20000",
	USER_NOT_FOUND: "F20001",
	INVALID_USER_DATA: "F20002",
	USER_ALREADY_DELETED: "F20003",

	// Erros relacionados a grupos (30000-39999)
	GROUP_NOT_FOUND: "F30000",
	GROUP_ALREADY_EXISTS: "F30001",
	GROUP_FULL: "F30002",
	GROUP_ALREADY_DRAWN: "F30003",
	GROUP_NOT_READY: "F30004",
	GROUP_ALREADY_DELETED: "F30005",
	GROUP_INVALID_DATE: "F30006",
	GROUP_INVALID_BUDGET: "F30007",
	GROUP_INVALID_PARTICIPANTS: "F30008",

	// Erros relacionados a matches/sorteio (40000-49999)
	MATCH_NOT_FOUND: "F40000",
	USER_ALREADY_IN_GROUP: "F40001",
	USER_NOT_IN_GROUP: "F40002",
	INVALID_MATCH_OPERATION: "F40003",
	INSUFFICIENT_PARTICIPANTS: "F40004",
	DRAW_ALREADY_COMPLETED: "F40005",
	INVALID_DRAW_OPERATION: "F40006",
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

export interface AppErrorParams {
	code: ErrorCode
	message: string
	httpStatus: number
	details?: Record<string, unknown>
}

export class AppError extends Error {
	public readonly code: ErrorCode
	public readonly httpStatus: number
	public readonly datetime: string
	public readonly details?: Record<string, unknown>

	constructor({ code, message, httpStatus, details }: AppErrorParams) {
		super(message)
		this.code = code
		this.httpStatus = httpStatus
		this.details = details
		this.name = "AppError"
		this.datetime = new Date().toISOString()
		Error.captureStackTrace(this, this.constructor)
	}

	toJSON() {
		return {
			code: this.code,
			message: this.message,
			datetime: this.datetime,
			details: this.details,
		}
	}
}

export class ValidationError extends AppError {
	constructor(message: string, details?: Record<string, unknown>) {
		super({
			code: ErrorCodes.VALIDATION_ERROR,
			message: `Erro de validação: ${message}`,
			httpStatus: 400,
			details,
		})
		this.name = "ValidationError"
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string, identifier: string) {
		super({
			code: ErrorCodes.NOT_FOUND,
			message: `${resource} não encontrado: ${identifier}`,
			httpStatus: 404,
		})
		this.name = "NotFoundError"
	}
}

export class UserError extends AppError {
	constructor(
		code: ErrorCode,
		message: string,
		details?: Record<string, unknown>,
	) {
		super({
			code,
			message: `Erro de usuário: ${message}`,
			httpStatus: 400,
			details,
		})
		this.name = "UserError"
	}
}

export class GroupError extends AppError {
	constructor(
		code: ErrorCode,
		message: string,
		details?: Record<string, unknown>,
	) {
		super({
			code,
			message: `Erro de grupo: ${message}`,
			httpStatus: 400,
			details,
		})
		this.name = "GroupError"
	}
}

export class MatchError extends AppError {
	constructor(
		code: ErrorCode,
		message: string,
		details?: Record<string, unknown>,
	) {
		super({
			code,
			message: `Erro de sorteio: ${message}`,
			httpStatus: 400,
			details,
		})
		this.name = "MatchError"
	}
}

export const Errors = {
	// Erros genéricos
	unauthorized: (message: string) =>
		new AppError({
			code: ErrorCodes.UNAUTHORIZED,
			message: `Não autorizado: ${message}`,
			httpStatus: 401,
		}),
	forbidden: (message: string) =>
		new AppError({
			code: ErrorCodes.FORBIDDEN,
			message: `Acesso negado: ${message}`,
			httpStatus: 403,
		}),
	// Erros de usuário
	userNotFound: (id: string) => new NotFoundError("Usuário", id),
	userAlreadyExists: (email: string) =>
		new UserError(
			ErrorCodes.USER_ALREADY_EXISTS,
			`usuário já existe com o email: ${email}`,
		),
	userAlreadyDeleted: (id: string) =>
		new UserError(
			ErrorCodes.USER_ALREADY_DELETED,
			`usuário já foi excluído: ${id}`,
		),

	// Erros de grupo
	groupNotFound: (id: string) => new NotFoundError("Grupo", id),
	groupFull: (groupId: string, max: number) =>
		new GroupError(
			ErrorCodes.GROUP_FULL,
			`grupo atingiu o limite de ${max} participantes`,
			{ groupId, maxParticipants: max },
		),
	groupAlreadyDrawn: (groupId: string) =>
		new GroupError(ErrorCodes.GROUP_ALREADY_DRAWN, `sorteio já foi realizado`, {
			groupId,
		}),
	groupNotReady: (groupId: string, reason: string) =>
		new GroupError(
			ErrorCodes.GROUP_NOT_READY,
			`grupo não está pronto para sorteio: ${reason}`,
			{ groupId },
		),
	groupInvalidDate: (date: string) =>
		new GroupError(
			ErrorCodes.GROUP_INVALID_DATE,
			`data do evento inválida: ${date}`,
		),
	groupInvalidBudget: (budget: number) =>
		new GroupError(
			ErrorCodes.GROUP_INVALID_BUDGET,
			`valor do orçamento inválido: ${budget}`,
		),
	groupAlreadyDeleted: (id: string) =>
		new GroupError(
			ErrorCodes.GROUP_ALREADY_DELETED,
			`grupo já foi excluído: ${id}`,
		),

	// Erros de match/sorteio
	matchNotFound: (id: string) => new NotFoundError("Match", id),
	userAlreadyInGroup: (userId: string, groupId: string) =>
		new MatchError(
			ErrorCodes.USER_ALREADY_IN_GROUP,
			`usuário já participa do grupo`,
			{ userId, groupId },
		),
	userNotInGroup: (userId: string, groupId: string) =>
		new MatchError(
			ErrorCodes.USER_NOT_IN_GROUP,
			`usuário não participa do grupo`,
			{ userId, groupId },
		),
	insufficientParticipants: (
		groupId: string,
		current: number,
		required: number,
	) =>
		new MatchError(
			ErrorCodes.INSUFFICIENT_PARTICIPANTS,
			`número insuficiente de participantes (atual: ${current}, necessário: ${required})`,
			{ groupId, currentParticipants: current, requiredParticipants: required },
		),
	drawAlreadyCompleted: (groupId: string) =>
		new MatchError(
			ErrorCodes.DRAW_ALREADY_COMPLETED,
			`sorteio já foi realizado e não pode ser refeito`,
			{ groupId },
		),
}

// Schema do erro seguindo o padrão do Elysia
export const ErrorResponseSchema = t.Object({
	code: t.Enum(ErrorCodes),
	message: t.String(),
	datetime: t.String({ format: "date-time" }),
	details: t.Optional(t.Record(t.String(), t.Any())),
})
