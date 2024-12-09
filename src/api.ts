import { Hono } from "hono"
import groups from "./routes/groups"
import users from "./routes/user"

const api = new Hono()

api.options("/ping", (c) => {
	const res = {
		message: "pong",
		datetime: new Date().toISOString(),
	}
	return c.json(res)
})

api.route("/groups", groups)
api.route("/users", users)

export default api
