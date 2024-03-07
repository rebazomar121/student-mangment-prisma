import { Request, Response } from "express" // Import Request and Response types from Express
import UserModal from "./users.model"
import { USER_UTILS } from "./users.utils"
import { User, Otp } from "./users.types.d"
import { SMS_SENDER } from "../../helpers/smsSender"
import { tokenGenerator } from "../../helpers/func"

const register = async (req: Request, res: Response) => {
  try {
    let { username, password, phoneNumber } = req.body
    // check is username exist
    if (await UserModal.findOne({ username }))
      throw Error("Username Already Exist")

    password = await USER_UTILS.createHashPassword(password)
    if (!password) throw Error("Please Enter Your Password")

    // create user
    const user: User = await UserModal.create({
      username,
      password,
      phone: {
        number: phoneNumber,
      },
    })

    // create token
    let userToken = await USER_UTILS.genToken({
      _id: user._id,
    })

    // create otp
    const otp: Otp | boolean | any = await USER_UTILS.makeOtp(user)
    if (!otp) throw Error("something went wrong")

    // send sms
    const config = {
      domain: process.env.SMS_DOMAIN,
      apiKey: process.env.SMS_API_KEY,
    }
    const message = `your otp is ${otp.code}`
    const companyName = "your company name"
    await SMS_SENDER.sendSms(config, phoneNumber, message, companyName)

    return res.status(201).send({
      user,
      token: userToken,
      success: true,
      message: "User created successfully",
    })
  } catch (error: any | undefined) {
    return res.status(500).send(error?.message)
  }
}

const verifyPhone = async (req: Request | any, res: Response) => {
  try {
    const { code } = req.params
    const { user } = req
    // validate requirement fields
    if (!code) throw Error("please write all filed's")
    // is user exist and active
    const ExistUser: User = await UserModal.findOne({
      username: user.username,
      isActive: true,
    })
    if (!ExistUser) throw new Error("user not found")
    if (ExistUser?.otp?.code !== code) throw new Error("otp not match")
    // check otp expireAt
    if (ExistUser?.otp?.expireAt < new Date()) throw new Error("otp expired")

    await UserModal.updateOne(
      { _id: ExistUser._id },
      {
        otp: {
          code: null,
          expireAt: null,
        },
        phone: {
          isVerified: true,
        },
      }
    )

    return res.status(201).send({
      success: true,
      message: "phone verified successfully",
    })
  } catch (error: any | undefined) {
    return res.status(500).send(error?.message)
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    // validate requirement fields
    if (!username || !password) throw Error("please write all filed's")
    // is user exist and active
    const user: User = await UserModal.findOne({
      username,
      isActive: true,
    })
    if (!user) throw new Error("user not found")
    // check password
    const valid = await user?.comparePassword(password)
    if (!valid) throw new Error("password not match")

    // create token and it will create new sessionToken the previous one will be invalid
    const token: any = await USER_UTILS.genToken({
      _id: user._id,
    })

    return res.status(201).send({
      user,
      token,
      success: true,
      message: "User logged in successfully",
    })
  } catch (error: any | undefined) {
    return res.status(500).send(error?.message)
  }
}

const myProfile = async (req: Request | any, res: Response) => {
  try {
    const { user } = req

    return res.status(201).send({
      user,
      success: true,
      message: "User logged in successfully",
    })
  } catch (error: any | undefined) {
    return res.status(500).send(error?.message)
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body
    const user: User = await UserModal.findOne({
      "phone.number": phoneNumber,
    })
    if (!user) throw new Error("user not found")
    const otp: Otp | boolean | any = await USER_UTILS.makeOtp(user)
    if (!otp) throw Error("something went wrong")

    // send sms
    const config = {
      domain: process.env.SMS_DOMAIN,
      apiKey: process.env.SMS_API_KEY,
    }
    const message = `your otp is ${otp.code}`
    const companyName = "your company name"
    await SMS_SENDER.sendSms(config, user?.phone?.number, message, companyName)

    return res.status(201).send({
      success: true,
      message: "otp sent successfully",
    })
  } catch (error: any | undefined) {
    return res.status(500).send(error?.message)
  }
}

const verifyForgotPassword = async (req: Request | any, res: Response) => {
  try {
    const { code } = req.params
    const { user } = req
    // validate requirement fields
    if (!code) throw Error("please write all filed's")
    // is user exist and active
    const ExistUser: User = await UserModal.findOne({
      username: user.username,
      isActive: true,
    })
    if (!ExistUser) throw new Error("user not found")
    if (ExistUser?.otp?.code !== code) throw new Error("otp not match")
    // check otp expireAt
    if (ExistUser?.otp?.expireAt < new Date()) throw new Error("otp expired")

    // tokenGenerator
    const resetPasswordToken: string | boolean = await tokenGenerator()
    if (!resetPasswordToken) throw Error("something went wrong")

    await UserModal.updateOne(
      { _id: ExistUser._id },
      {
        otp: {
          code: null,
          expireAt: null,
        },
        resetPasswordToken: resetPasswordToken,
      }
    )

    return res.status(201).send({
      success: true,
      token: resetPasswordToken,
      message: "otp verified successfully",
    })
  } catch (error: any | undefined) {
    return res.status(500).send(error?.message)
  }
}

const resetPasswordWithToken = async (req: Request | any, res: Response) => {
  try {
    const { password, resetPasswordToken } = req.body
    // validate requirement fields
    if (!password) throw Error("please write all filed's")
    // is user exist and active
    const ExistUser: User = await UserModal.findOne({
      resetPasswordToken,
      isActive: true,
    })
    if (!ExistUser) throw new Error("user not found")

    const hashedPassword = await USER_UTILS.createHashPassword(password)
    if (!hashedPassword) throw Error("something went wrong")

    await UserModal.updateOne(
      { _id: ExistUser._id },
      {
        password: hashedPassword,
        resetPasswordToken: null,
      }
    )

    return res.status(201).send({
      success: true,
      message: "password reset successfully",
    })
  } catch (error: any | undefined) {
    return res.status(500).send(error?.message)
  }
}

const CONTROLLERS = {
  register,
  login,
  myProfile,
  verifyPhone,
  forgotPassword,
  verifyForgotPassword,
  resetPasswordWithToken,
}

export default CONTROLLERS
