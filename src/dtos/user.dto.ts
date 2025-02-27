import { t } from "elysia"

export const UserDTO = t.Object({
	id: t.String({
		title: "Identificador",
		description: "É o identificador único para o usuário",
		example: "123abc456",
	}),
	firstName: t.String({
		title: "Primeiro Nome",
		description: "Primeiro nome do usuário",
		example: "João",
		minLength: 2,
		maxLength: 30,
	}),
	lastName: t.String({
		title: "Sobrenome",
		description: "Sobrenome do usuário",
		example: "Silva",
		minLength: 2,
		maxLength: 50,
	}),
	fullName: t.String({
		title: "Nome Completo",
		description: "Nome Completo",
		example: "João Silva",
		minLength: 2,
		maxLength: 70,
	}),
	email: t.String({
		title: "E-mail",
		description: "E-mail do usuário",
		format: "email",
		example: "joaosilva@exemplo.com",
	}),
	phone: t.String({
		title: "Telefone",
		description:
			"É o telefone do usuário. Deve seguir no padrão brasileiro de 11 dígitos",
		format: "phone",
		example: "12345678910",
		pattern: "//^\\d{11}/g",
		minLength: 11,
		maxLength: 11,
	}),
	createdAt: t.String({
		title: "Data de Criação",
		description: "Data de criação do usuário",
		example: "2023-05-01T00:00:00.000Z",
		format: "date-time",
	}),
	updatedAt: t.String({
		title: "Data de Atualização",
		description: "Data de atualização dos dados do usuário",
		example: "2023-05-01T00:00:00.000Z",
		format: "date-time",
	}),
	deletedAt: t.Nullable(
		t.String({
			title: "Data de Exclusão",
			description: "Data de exclusão do usuário",
			example: "2023-05-01T00:00:00.000Z",
			format: "date-time",
		}),
	),
})

export const CreateUserDTO = t.Object({
	firstName: t.String({
		title: "Primeiro Nome",
		description: "Primeiro nome do usuário",
		example: "João",
		minLength: 2,
		maxLength: 30,
	}),
	lastName: t.String({
		title: "Sobrenome",
		description: "Sobrenome do usuário",
		example: "Silva",
		minLength: 2,
		maxLength: 50,
	}),
	email: t.String({
		title: "E-mail",
		description: "E-mail do usuário",
		format: "email",
		example: "joaosilva@exemplo.com",
	}),
	phone: t.String({
		title: "Telefone",
		description:
			"É o telefone do usuário. Deve seguir no padrão brasileiro de 11 dígitos",
		format: "phone",
		example: "12345678910",
		pattern: "//^\\d{11}/g",
		minLength: 11,
		maxLength: 11,
	}),
})

export const UpdateUserDTO = t.Partial(CreateUserDTO)

export type TUserDTO = typeof UserDTO.static
export type TCreateUserDTO = typeof CreateUserDTO.static
export type TUpdateUserDTO = typeof UpdateUserDTO.static
