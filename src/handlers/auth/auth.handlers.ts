// src/presentation/auth/auth.handler.ts
import { type Elysia, t } from "elysia"
import { authMiddleware } from "./auth.middleware"
import type { AuthService } from "@/services/auth.service"
import { handleError } from "@/lib/handlers"
import { ErrorResponseSchema } from "@/lib/errors"
import {
	LoginRequestDTO,
	TokenVerificationDTO,
	AuthResponseDTO,
	RefreshTokenDTO,
	RefreshResponseDTO,
	LogoutRequestDTO,
} from "@/dtos/auth.dto"

export const authHandler = (app: Elysia, authService: AuthService) => {
	app
		.use(authMiddleware)
		.post(
			"/login",
			async ({ body, set }) => {
				try {
					await authService.requestLoginToken(body.email)
					return { message: "Token de acesso enviado para seu email" }
				} catch (error) {
					return handleError(error, set)
				}
			},
			{
				body: LoginRequestDTO,
				response: {
					200: t.Object({
						message: t.String(),
					}),
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
					500: ErrorResponseSchema,
				},
				detail: {
					summary: "Solicitar Login",
					description: "Solicita um token de acesso que será enviado por email",
				},
			},
		)
		.post(
			"/verify",
			async ({ body, set, jwt }) => {
				try {
					// O service já verifica e lança exceções se necessário
					const user = await authService.verifyEmailToken(
						body.email,
						body.token,
					)

					// Geramos os tokens
					const refreshToken = await authService.createRefreshToken(user.id)

					// Criamos o payload para o JWT
					const payload = {
						sub: user.id,
						email: user.email,
						name: `${user.firstName} ${user.lastName}`,
						iat: Math.floor(Date.now() / 1000),
						exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
					}

					// Geramos o JWT usando o contexto Elysia
					const accessToken = await jwt.sign(payload)

					return {
						accessToken,
						refreshToken: refreshToken.token,
						refreshTokenExpiresAt: refreshToken.expiresAt,
						user: {
							id: user.id,
							email: user.email,
							name: `${user.firstName} ${user.lastName}`,
						},
					}
				} catch (error) {
					return handleError(error, set)
				}
			},
			{
				body: TokenVerificationDTO,
				response: {
					200: AuthResponseDTO,
					400: ErrorResponseSchema,
					401: ErrorResponseSchema,
					500: ErrorResponseSchema,
				},
				detail: {
					summary: "Verificar Token",
					description:
						"Verifica o token recebido por email e gera tokens JWT de acesso",
				},
			},
		)
		.post(
			"/refresh",
			async ({ body, set, jwt }) => {
				try {
					// Service já verifica e lança exceções
					await authService.verifyRefreshToken(body.userId, body.refreshToken)

					// Busca dados do usuário
					const user = await authService.getUserById(body.userId)

					// Geramos um novo JWT
					const payload = {
						sub: user.id,
						email: user.email,
						name: `${user.firstName} ${user.lastName}`,
						iat: Math.floor(Date.now() / 1000),
						exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
					}

					// Assinamos o JWT
					const accessToken = await jwt.sign(payload)

					return {
						accessToken,
						user: {
							id: user.id,
							email: user.email,
							name: `${user.firstName} ${user.lastName}`,
						},
					}
				} catch (error) {
					return handleError(error, set)
				}
			},
			{
				body: RefreshTokenDTO,
				response: {
					200: RefreshResponseDTO,
					400: ErrorResponseSchema,
					401: ErrorResponseSchema,
					404: ErrorResponseSchema,
					500: ErrorResponseSchema,
				},
				detail: {
					summary: "Renovar Token",
					description: "Renova o token JWT de acesso usando um refresh token",
				},
			},
		)
		.post(
			"/logout",
			async ({ body, set }) => {
				try {
					await authService.revokeRefreshToken(body.userId)
					return { message: "Logout realizado com sucesso" }
				} catch (error) {
					return handleError(error, set)
				}
			},
			{
				body: LogoutRequestDTO,
				response: {
					200: t.Object({
						message: t.String(),
					}),
					400: ErrorResponseSchema,
					500: ErrorResponseSchema,
				},
				detail: {
					summary: "Logout",
					description: "Revoga o refresh token, realizando o logout do usuário",
				},
			},
		)

	return app
}
