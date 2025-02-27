import { t } from "elysia"

export const MatchesDTO = t.Object({
	id: t.String({
		title: "Identificador",
		description: "Identificador único para o match",
		example: "123abc456",
	}),
	groupId: t.String({
		title: "Identificador do Grupo",
		description: "Identificador único para o grupo",
		example: "123abc456",
	}),
	userId: t.String({
		title: "Identificador do Usuário",
		description: "Identificador único para o usuário",
		example: "123abc456",
	}),
	friendId: t.String({
		title: "Identificador do Amigo",
		description: "Identificador único para o amigo",
		example: "123abc456",
	}),
	joinedAt: t.String({
		title: "Data de Entrada",
		description: "Data de entrada no grupo no padrão ISO 8601",
		example: "2023-05-01T00:00:00.000Z",
		format: "date-time",
	}),
	matchedAt: t.Optional(
		t.String({
			title: "Data de Sorteio",
			description:
				"Data em que foi realizado o sorteio no grupo no padrão ISO 8601",
			example: "2023-05-01T00:00:00.000Z",
			format: "date-time",
		}),
	),
})

export const CreateMatchesDTO = t.Object({
	groupId: t.String({
		title: "Identificador do Grupo",
		description: "É o identificador do grupo ao qual o usuário irá participar",
		example: "group123",
	}),
	userId: t.String({
		title: "Identificador do Usuário",
		description: "É o identificador do usuário que irá participar do grupo",
		example: "user123",
	}),
})

export const UpdateMatchesDTO = t.Object({
	friendId: t.String({
		title: "Identificador do Amigo Secreto",
		description: "É o identificador do amigo secreto sorteado para o usuário",
		example: "friend123",
	}),
})

export type TMatchesDTO = typeof MatchesDTO.static
export type TCreateMatchesDTO = typeof CreateMatchesDTO.static
export type TUpdateMatchesDTO = typeof UpdateMatchesDTO.static
