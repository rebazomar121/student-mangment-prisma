import express from "express"
const router = express.Router()

import ROUTE_USERS from "./users/users.routes"

router.use("/users", ROUTE_USERS)

export default router
