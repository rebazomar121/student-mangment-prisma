import express from "express"
const router = express.Router()

import CONTROLLERS from "./users.controllers"
import { USER_MIDDLEWARE } from "./users.middlewares"

router.post("/", CONTROLLERS.register)
router.post("/", CONTROLLERS.login)
router.get("/", USER_MIDDLEWARE.authorization, CONTROLLERS.myProfile)
router.post(
  "/verifyPhone/:code",
  USER_MIDDLEWARE.authorization,
  CONTROLLERS.verifyPhone
)
router.post("/forgotPassword", CONTROLLERS.forgotPassword)
router.post("/verifyForgotPassword/:code", CONTROLLERS.verifyForgotPassword)
router.post("/resetPasswordWithToken", CONTROLLERS.resetPasswordWithToken)

export default router
