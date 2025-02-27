import { t } from "elysia"

export const LoginRequestDTO = t.Object({
	email: t.String({
		format: "email",
		minLength: 5,
		maxLength: 128,
		title: "E-mail",
		description: "E-mail do usuário",
		examples: ["john.doe@test.com"],
		error: "Email inválido",
	}),
})

export const TokenVerificationDTO = t.Object({
	token: t.String({
		title: "Token",
		description: "Token de verificação enviado por email",
		minLength: 32,
		maxLength: 32,
		examples: ["a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"],
		error: "Token inválido",
	}),
	email: t.String({
		format: "email",
		minLength: 5,
		maxLength: 128,
		title: "E-mail",
		description: "E-mail do usuário",
		examples: ["john.doe@test.com"],
		error: "E-mail inválido",
	}),
})

// Resposta da verificação do token de email
export const AuthResponseDTO = t.Object({
	accessToken: t.String({
		title: "Access Token",
		description: "JWT para autenticação nas requisições",
		examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
	}),
	refreshToken: t.String({
		title: "Refresh Token",
		description: "Token para renovar o access token quando expirar",
		examples: ["a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"],
	}),
	refreshTokenExpiresAt: t.String({
		title: "Data de Expiração do Refresh Token",
		description: "Data/hora de expiração do refresh token no formato ISO",
		format: "date-time",
		examples: ["2023-01-01T12:00:00.000Z"],
	}),
	user: t.Object({
		id: t.String({
			title: "ID",
			description: "ID do usuário",
			examples: ["12A45B7C90"],
		}),
		email: t.String({
			title: "E-mail",
			description: "E-mail do usuário",
			examples: ["john.doe@test.com"],
		}),
		name: t.String({
			title: "Nome",
			description: "Nome completo do usuário",
			examples: ["John Doe"],
		}),
	}),
})

// DTO para renovação do token
export const RefreshTokenDTO = t.Object({
	userId: t.String({
		title: "ID do Usuário",
		description: "ID do usuário para quem o token será renovado",
		examples: ["12A45B7C90"],
	}),
	refreshToken: t.String({
		title: "Refresh Token",
		description: "Token utilizado para renovação do access token",
		examples: ["a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"],
	}),
})

// Resposta da renovação do token
export const RefreshResponseDTO = t.Object({
	accessToken: t.String({
		title: "Access Token",
		description: "Novo JWT para autenticação nas requisições",
		examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
	}),
	user: t.Object({
		id: t.String({
			title: "ID",
			description: "ID do usuário",
			examples: ["12A45B7C90"],
		}),
		email: t.String({
			title: "E-mail",
			description: "E-mail do usuário",
			examples: ["john.doe@test.com"],
		}),
		name: t.String({
			title: "Nome",
			description: "Nome completo do usuário",
			examples: ["John Doe"],
		}),
	}),
})

// DTOs para logout
export const LogoutRequestDTO = t.Object({
	userId: t.String({
		title: "ID do Usuário",
		description: "ID do usuário que deseja fazer logout",
		examples: ["12A45B7C90"],
	}),
})

export type TLoginRequestDTO = typeof LoginRequestDTO.static
export type TTokenVerificationDTO = typeof TokenVerificationDTO.static
export type TAuthResponseDTO = typeof AuthResponseDTO.static
export type TRefreshTokenDTO = typeof RefreshTokenDTO.static
export type TRefreshResponseDTO = typeof RefreshResponseDTO.static
export type TLogoutRequestDTO = typeof LogoutRequestDTO.static
