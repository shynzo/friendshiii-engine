import swagger from "@elysiajs/swagger"
import { Elysia } from "elysia"
import { users } from "./routes/users-route"
import { groups } from "./routes/groups-route"

const app = new Elysia()
	.use(
		swagger({
			version: "1.0.0",
			path: "/docs",
			scalarConfig: {
				favicon: "../assets/shi.svg",
				metaData: {
					title: "Friendshii API 🤫",
					description: "API para o Friendshii",
				},
			},
			documentation: {
				info: {
					title: "Friendshii API 🤫",
					description: "API para o Friendshii",
					version: "1.0.0",
				},
			},
		}),
	)
	.use(users)
	.use(groups)
	.get("/", () => "Hello World!")
	.listen(3000)

console.log("Server started on port 3000")
