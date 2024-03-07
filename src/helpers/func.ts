import crypto from "crypto"

/**
 * Generates a random token using crypto.
 *
 * @returns {Promise<string | boolean>} A Promise that resolves with the generated token or false in case of an error.
 */
export const tokenGenerator = async (): Promise<string | boolean> => {
  try {
    let token = await crypto.randomBytes(32).toString("hex")
    return token && token
  } catch (error) {
    return false
  }
}
