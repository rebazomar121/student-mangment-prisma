import { Document, Mongoose, SchemaTimestampsConfig } from "mongoose"

interface MongooseDoc extends Document, SchemaTimestampsConfig {}

type Otp = {
  code: string
  expireAt: Date
}

type Phone = {
  number: string
  isVerified: boolean
}

interface User extends MongooseDoc {
  _id: Object
  username: string
  password: string
  isActive: boolean
  sessionToken: string
  resetPasswordToken: string
  phone: Phone
  otp: Otp
  comparePassword: (password: string) => Promise<boolean>
}

type GenTokenProps = {
  _id: string | Object
}
