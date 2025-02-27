import { GroupStatus } from "@/data/schemas/group"
import { t } from "elysia"

export const GroupDTO = t.Object({
	id: t.String({
		title: "Identificador",
		description: "É o identificador único para o grupo",
		example: "123abc456",
	}),
	name: t.String({
		title: "Nome",
		description: "Nome do grupo",
		example: "Grupo de Amigos",
		minLength: 2,
		maxLength: 50,
	}),
	description: t.Nullable(
		t.String({
			title: "Descrição",
			description: "Descrição do grupo",
			example: "Grupo de amigos para desenvolvedores",
			minLength: 2,
			maxLength: 100,
		}),
	),
	status: t.String({
		title: "Status",
		description: "Status do grupo",
		examples: Object.values(GroupStatus),
		pattern: Object.values(GroupStatus).join("|"),
	}),
	ownerId: t.String({
		title: "Identificador do dono",
		description: "Identificador do dono do grupo",
		example: "123abc456",
	}),
	eventDate: t.String({
		title: "Data do Evento",
		description: "Data do evento",
		example: "2023-05-01T00:00:00.000Z",
		format: "date-time",
	}),
	budget: t.Nullable(
		t.Number({
			title: "Limite de valor",
			description: "Valor máximo permitido para o presente do amigo secreto",
			example: 1000,
			minimum: 0,
		}),
	),
	maximumParticipants: t.Nullable(
		t.Number({
			title: "Máximo de Participantes",
			description: "Máximo de participantes no grupo",
			example: 10,
			minimum: 1,
		}),
	),
	theme: t.Nullable(
		t.String({
			title: "Tema",
			description: "Tema do grupo",
			example: "Escritório",
			minLength: 2,
			maxLength: 30,
		}),
	),
})

export const CreateGroupDTO = t.Object({
	name: t.String({
		title: "Nome",
		description: "Nome do grupo",
		example: "Grupo de Amigos",
		minLength: 2,
		maxLength: 50,
	}),
	description: t.String({
		title: "Descrição",
		description: "Descrição do grupo",
		example: "Grupo de amigos para desenvolvedores",
		minLength: 2,
		maxLength: 100,
	}),
	ownerId: t.String({
		title: "Identificador do dono",
		description: "Identificador do dono do grupo",
		example: "123abc456",
	}),
	eventDate: t.String({
		title: "Data do Evento",
		description: "Data do evento no padrão ISO 8601",
		example: "2023-05-01T00:00:00.000Z",
		format: "date-time",
	}),
	budget: t.Number({
		title: "Orçamento",
		description: "Orçamento do grupo",
		example: 1000,
		minimum: 0,
	}),
	maximumParticipants: t.Number({
		title: "Máximo de Participantes",
		description: "Máximo de participantes no grupo",
		example: 10,
		minimum: 1,
	}),
	theme: t.String({
		title: "Tema",
		description: "Tema do grupo",
		example: "Escritório",
		minLength: 2,
		maxLength: 30,
	}),
})

export const UpdateGroupDTO = t.Partial(CreateGroupDTO)

export type TGroupDTO = typeof GroupDTO.static
export type TCreateGroupDTO = typeof CreateGroupDTO.static
export type TUpdateGroupDTO = typeof UpdateGroupDTO.static
