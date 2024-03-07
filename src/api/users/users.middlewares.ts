import { Request, Response, NextFunction } from "express" // Import Request and Response types from Express
import { USER_UTILS } from "./users.utils"

/**
 * Middleware for user authorization.
 *
 * @param {Request | any} req - The Express Request object, which may contain a user property.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction to call the next middleware or route handler.
 */
const authorization = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // we can use this token to get user data
    const token = req.headers.authorization
    // we will find the user by token user
    const user = await USER_UTILS.getUser(token)
    if (!user) throw Error("unauthorized")

    // we will add user to req.user so we can use it in the next middleware or controller
    req.user = user
    next()
  } catch (error: any | undefined) {
    return res.status(401).send(error?.message)
  }
}

export const USER_MIDDLEWARE = {
  authorization,
}
