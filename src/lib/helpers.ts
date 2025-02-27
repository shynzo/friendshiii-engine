import type { TUserDTO } from "@/dtos/user.dto"
import { customAlphabet } from "nanoid"

export const generateId = () => {
	const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10)
	return nanoid()
}

export const generateAuthToken = () => {
	const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 21)
	return nanoid()
}

export const withFullName = (user: Omit<TUserDTO, "fullName">): TUserDTO => ({
	...user,
	fullName: `${user.firstName} ${user.lastName}`,
})

export function generateToken(length: number): string {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let result = ""
	const randomValues = new Uint8Array(length)
	crypto.getRandomValues(randomValues)
	randomValues.forEach((v) => (result += charset[v % charset.length]))
	return result
}
