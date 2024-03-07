const DATABASE_URL: string = process.env.DATABASE_URL || ""
const MONGODB_SUCCESS_MESSAGE: string = "Database connected..."
const MONGODB_FAILED_MESSAGE: string = "No mongo uri was provided."

export const MONGODB_CONST = {
  DATABASE_URL,
  MONGODB_SUCCESS_MESSAGE,
  MONGODB_FAILED_MESSAGE,
}
