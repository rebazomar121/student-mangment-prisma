import bcrypt from "bcryptjs"
import crypto from "crypto"
import { GenTokenProps, User, Otp } from "./users.types.d"
import UserModal from "./users.model"
import { uuid } from "uuidv4"
import mongoose from "mongoose"
import jwt_decode from "jwt-decode"
import jwt from "jsonwebtoken"

/**
 * Creates a hash of the given password.
 *
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string | boolean>} A Promise that resolves with the hashed password or false in case of an error.
 */
const createHashPassword = async ({ password }: any) => {
  try {
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)
    return password
  } catch (error) {
    return false
  }
}

/**
 * Generates a session token using UUID.
 *
 * @returns {Promise<string | boolean>} A Promise that resolves with the session token or false in case of an error.
 */
const genSessionToken = async () => {
  try {
    let token = await uuid().replace(/-/g, "")
    return token && token
  } catch (error) {
    return false
  }
}

/**
 * Encrypts the provided token using the given encryption key.
 *
 * @param {string} tokenToEncrypted - The token to be encrypted.
 * @param {string} encryptionKey - The encryption key.
 * @returns {string} The encrypted token.
 */
const encrypt = (
  tokenToEncrypted: string | any,
  encryptionKey: string | any
): string => {
  const algorithm = "aes-256-cbc"
  const key = crypto
    .createHash("sha256")
    .update(encryptionKey)
    .digest("base64")
    .substr(0, 32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(tokenToEncrypted, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + encrypted
}

/**
 * Decrypts the provided encrypted token using the given encryption key.
 *
 * @param {string} encrypted - The encrypted token.
 * @param {string} encryptionKey - The encryption key.
 * @returns {string} The decrypted token.
 */
const decrypt = (encrypted: string, encryptionKey: string | any): string => {
  const algorithm = "aes-256-cbc"
  const key = crypto
    .createHash("sha256")
    .update(encryptionKey)
    .digest("base64")
    .substr(0, 32)
  const iv = Buffer.from(encrypted.slice(0, 32), "hex")
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted.slice(32), "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

/**
 * Generates an authentication token for the given user ID and session token.
 *
 * @param {GenTokenProps} props - The properties for generating the token.
 * @returns {Promise<string>} A Promise that resolves with the generated token.
 */
const genToken = async (props: GenTokenProps): Promise<any> => {
  const { _id } = props

  const sessionToken = await genSessionToken()
  const encryptedSessionToken = await encrypt(
    sessionToken,
    process.env.ENCRYPTION_KEY
  )

  const encrypted_ID = await encrypt(_id.toString(), process.env.ENCRYPTION_KEY)
  await UserModal.updateOne({ _id }, { sessionToken: sessionToken })

  // Sign the token with the encrypted payload
  const token = jwt.sign(
    { _id: encrypted_ID, sessionToken: encryptedSessionToken },
    process.env.JWT_SECRET_KEY || ""
  )
  return token
}

/**
 * Retrieves user information based on the provided token.
 *
 * @param {string} token - The authentication token.
 * @returns {Promise<User | null | undefined>} A Promise that resolves with the user information, null, or undefined.
 */
const getUser = async (token: string) => {
  try {
    // if token is null or undefined or empty string return undefined
    if (token === null || token === undefined || token === "") return undefined
    // decode token
    const decoded: any = jwt_decode(token)
    // decrypt _id
    const decrypted_ID = await decrypt(decoded?._id, process.env.ENCRYPTION_KEY)
    // get user by _id we will use mongoose.Types.ObjectId to convert string to ObjectId
    const _id = new mongoose.Types.ObjectId(decrypted_ID)
    const user: any = await UserModal.findById(_id)
    // decrypt sessionToken
    const decryptedSessionToken = await decrypt(
      decoded.sessionToken,
      process.env.ENCRYPTION_KEY
    )
    // check if sessionToken is equal to user.sessionToken
    return user?.sessionToken == decryptedSessionToken ? user : null
  } catch (error) {
    return false
  }
}

/**
 * Generates a one-time password (OTP) for a user.
 *
 * @param {User} user - The user for whom the OTP is generated.
 * @returns {Promise<Otp | boolean>} A Promise that resolves with the OTP or false in case of an error.
 */
const makeOtp = async (user: User): Promise<Otp | boolean> => {
  try {
    const code: number | any = Math.floor(100000 + Math.random() * 900000)
    const expireAt: Date = new Date(Date.now() + 5 * 60 * 1000)
    await UserModal.updateOne(
      { _id: user._id },
      {
        otp: {
          code,
          expireAt,
        },
      }
    )
    return { code, expireAt }
  } catch (error) {
    return false
  }
}

export const USER_UTILS = {
  createHashPassword,
  genToken,
  getUser,
  makeOtp,
}
